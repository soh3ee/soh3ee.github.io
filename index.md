---
layout: default
---
<div id="index-container" class="container h-100 w-100">
    <div class="row h-100">
        <!-- side-panel -->
        <div id="mobile-left-container" class="w-100 top align-items-center">
            <div class="">
                <a href="/" class="cs-text-white text-decoration-none" style="font-size: 14px;"><strong>soh3ee - 소희</strong></a>
            </div>
        </div>
        <div id="left-container" class="h-100 col-2 pt-3">
            <!-- side-panel's header -->
            <div class="mb-5">
                <a href="/" class="cs-text-white text-decoration-none" style="font-size: 14px;"><strong>soh3ee - 소희</strong></a>
            </div>
            <div>
                <ul class="nav flex-column">
                    <h5 class="cs-text-light-gray" style="font-size: 12px;">COOL STUFF</h5>
                    <li class="nav-item py-1">
                        <a href="#" id="writeupsBtn" class="btn btn-primary cs-bg-transparent active border-0 w-100 text-start" role="button" aria-pressed="false" data-toggle="button" style="font-size: 14px;" tabindex="-1" role="button">Writeups</a>
                    </li>
                    <!-- <li class="nav-item py-1">
                        <a href="#" id="programmingBtn" class="btn btn-secondary cs-bg-transparent border-0 w-100 text-start" role="button" aria-pressed="false" data-toggle="button" style="font-size: 14px;" tabindex="-1" role="button">Programming</a>
                    </li> -->
                </ul>

                <ul class="nav flex-column pt-5">
                    <h5 class="cs-text-light-gray" style="font-size: 12px;">SOCIALS</h5>
                    <li class="nav-item py-1">
                        <a href="https://github.com/soh3ee" class="btn btn-primary cs-bg-transparent border-0 w-100 text-start" role="button" aria-pressed="false" data-toggle="button" style="font-size: 14px;" tabindex="-1" role="button">Github</a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- content container -->
        <div class="right-container overflow-scroll col-9 cs-bg-gray pe-0 float-end" style="border-radius: 25px;">
            <div id="content-container" style="padding-top: 4rem !important;" class="container px-5 py-5">
                <div class=row>
                    <div class="col-3 mx-auto">
                        <h2 class="cs-text-white">Writeups</h2>
                    </div>
                    <div class="col-7 mx-auto">
                        <p style="color: #b6b5b4 !important; line-height: 1.9; font-size: 15px;">I enjoy doing cybersecurity challenges such as HackTheBox during my free time. From time to time I make writeups demonstrating my thought process because it's cool.</p>
                    </div>
                </div>
                {% include new_list_posts.html %}
            </div>
        </div>
    </div>
</div>
