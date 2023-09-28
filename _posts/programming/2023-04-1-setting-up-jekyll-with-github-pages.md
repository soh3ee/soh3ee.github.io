---
layout: post
title:  "Setting Up Jekyll With Github Pages"
name: "settingUpJekyllWithGithubPages"
date:   2023-03-24 07:44
author: "soh3ee"
categories: programming 
toc: true
--- 
{% assign image_path = site.data.categories[1].image_path %}
As someone who loves web development, Jekyll was an enjoyable and low-key addicting experience, espeically throughout my spring break. Here's a quick guide on how to get started with Jekyll locally and eventually hosting it through Github Pages.

<!-- Since I found initially understanding Jekyll's rendering process and Liquid formatting the most confusing, here's a simple post that might help you get started. -->
<!-- As someone who enjoys web development, working on my site powered by Jekyll was an enjoyable and low-key addicting experience. As soon as spring break hit, I began to design my site. Unsatisifed with the idea of using another person's theme or templates, I decided to design my own. Although my friends said I was crazy, I worked throughout my spring break nights to produce this website. It ain't much, but it's honest work. So here's how you can do it too! ʘ‿ʘ -->

## Getting Started Locally
Eventually, you will push your changes to a Github repository with the name format: `<your_github_username>@github.site.io`. But before that, you're going to need to have something to push to the repository. You're also going to need to be able to test these changes easily, especially for something like web development. (Could you imagine pushing to your repository and waiting for Github to build your entire page to check if your div was centered? (๏  。๏)) 

1. ### Installing Jekyll
{: .numbered-list }

[Jekyll's documentation on the installation process](https://jekyllrb.com/docs/installation/){: .bold .underline } has clear and detailed instructions for different operating systems.

{:start="2"}
2. ### Create a Page Directory
{: .numbered-list }

*My tutorial will be in reference to Linux/MacOS, although I these steps apply similarly to a Windows machine.* 
In your terminal:

```
// creating local directory
mkdir <your_github_username>@github.site.io
cd <your_githu_username>@github.site.io

// initializing our directory with Jekyll's default content 
jekyll new .
```
And that's basically it! If you run `bundle exec jekyll serve`, you should be able to navigate to `http://localhost:4000` to see your locally hosted site.

But obviously we want some customization, ay? You can read about that [here](here){: .bold .underline }.

<!-- ## understanding jekyll
The files that populate your directory may not make sense at first, so here's the visual hierarchy along with some descriptions. It's best to note that understanding how Jekyll renders your site and what it looks for while doing so will you save you hours of troubleshooting, I promise. ミ●﹏☉ミ
```  
.
├── 404.html // the page displayed when a 404 error occurs; e.g. page not found
├── Gemfile // file where you specify what gems and versions you want installed
├── Gemfile.lock // tbh no idea, don't really have to touch this
├── _config.yml // super important. where you specify site-wide variables
├── _posts // where all your posts go
│   └── 2023-04-01-welcome-to-jekyll.markdown
├── _site // where Jekyll places your RENDERED site; don't make changes here.
│   ├── 404.html
│   ├── about
│   │   └── index.html
│   ├── assets
│   │   ├── main.css
│   │   ├── main.css.map
│   │   └── minima-social-icons.svg
│   ├── feed.xml
│   ├── index.html
│   └── jekyll
│       └── update
│           └── 2023
│               └── 04
│                   └── 01
│                       └── welcome-to-jekyll.html
├── about.markdown // sample about page
└── index.markdown // sample index page
```
You'll notice that `_site` is essentially a copy of your source directory. That's because after Jekyll renders your site, it puts the final product into `_site`. Think of it as putting the puzzle pieces of your site together, since you'll eventually have various layouts and include files you'll want to dynamically populate your site, rather than doing everything manually.



Some extra directories you'll want to create are `_layouts`, `_assets`, `_includes` and `_sass`. This is what your final directory should look like, alongside which I've provided the new directory descriptions.

```
.
├── 404.html
├── Gemfile
├── Gemfile.lock
├── _assets // usually contains images, css, and js files
├── _config.yml
├── _includes // usually contains templated partials, but don't fall under layout templates 
├── _layouts // layout templates for your different layouts 
├── _posts
│   └── 2023-04-01-welcome-to-jekyll.markdown
├── _sass // where your sass/scss files will go
├── _site
│   ├── 404.html
│   ├── about
│   │   └── index.html
│   ├── assets
│   │   ├── main.css
│   │   ├── main.css.map
│   │   └── minima-social-icons.svg
│   ├── feed.xml
│   ├── index.html
│   └── jekyll
│       └── update
│           └── 2023
│               └── 04
│                   └── 01
│                       └── welcome-to-jekyll.html
├── about.markdown
└── index.markdown
```

### _config.yml
Modify these site variables to your fit. Most of these variables aren't explicitly necessary, for example, `twitter_username`, but they are variables you can call later on in your posts using Liquid format, and also variables that Jekyll might use such as `baseurl` and `url`. 
```
title: Your awesome title
email: your-email@example.com
description: >- # this means to ignore newlines until "baseurl:"
  Write an awesome description for your new site here. You can edit this
  line in _config.yml. It will appear in your document head meta (for
  Google search results) and in your feed.xml site description.
baseurl: "" # the subpath of your site, e.g. /blog
url: "" # the base hostname & protocol for your site, e.g. http://example.com
twitter_username: jekyllrb
github_username:  jekyll
``` -->

### Gemfile
To configure your Gemfile to work with Github Pages, uncomment the following line by deleting the `#`:

``` ruby
# gem "github-pages", group: :jekyll_plugins
```
When you try hosting your page with `bundle exec jekyll serve`, but get this issue:

```
Could not find compatible versions

Because every version of github-pages depends on jekyll = 3.9.3
  and Gemfile depends on jekyll ~> 4.3.2,
  github-pages cannot be used.
So, because Gemfile depends on github-pages >= 0,
  version solving has failed.
```
modify your Gemfile so that the Jekyll version it is looking for is not 4.3.2, but 3.9.3, or whatever version shows up on your end.

``` ruby
gem "jekyll", "~> 3.9.3"
``` 

You may also undergo this issue:
```
cannot load such file -- webrick (LoadError)
```
Of which you can just issue `bundle add webrick`.

## Verifying Site Build on Github Pages 
Create your site repository on Github. To do this, navigate to [Github](https://github.com) and click `New Repository` at the top right corner over the `+` icon. 
![]({{ image_path }}{{ page.name }}/githubAddRepo.png)

Name it exactly like so: `<your_github_username>.github.io`
![]({{ image_path }}{{ page.name }}/githubRepoName.png)
*Mine already exists, which is why it's red.*

From here, return to your terminal and source directory, and invoke the following commands:
```
git init
git commit -m "first commit wazzoo"
git branch -M main
git remote add origin https://github.com/<your_github_user>/<your_site_repo>.git
git push -U origin main
```
As soon as it pushes, Github should immediately start building your site. And there you have it! Your initial Jekyll setup is complete. If you want to learn about further customization, styling, and understand how Jekyll works, feel free to check out my other posts.
{: .post-bottom-margin }





