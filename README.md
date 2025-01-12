# CASA0017 Web Assessment ReadMe File - Titan 6's

# UCL Accommodation Compass

This is the Final assessment template for CASA0017 - Please use this template and edit the relevant sections to personalise.
This section has a short introduction to what the website is about and what research problem the site is solving.  Remeber this file showcases your website source code so use it to sell what you can do as a group or showcase in a future portfolio. 

## Our valuable Contributors👩‍💻👨‍💻 :

<a href="https://github.com/Reikimen/casa0017-web-TiTan-6/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=Reikimen/casa0017-web-TiTan-6" />
</a>

# Intro of our Website

Use this section to show us what your Website is about. Include a Screenshot to the Website in this README file, link to the various frameworks you've used.  If you want to show off your website you can add a Gif of you interacting with your site.   Emojis are also fun to include as well 😄

Look at some other Websites online in GitHub and see how they use the README File to showcase thier site.  Good examples are:

- https://github.com/smaranjitghose/awesome-portfolio-websites
- https://github.com/gohugoio/hugo    
- https://github.com/academicpages/academicpages.github.io



# For Developers
> Attention! Developers on Win!

As Docker is mandatory required for this project, u need to download Docker on your Computer(Laptop). But pls donot install Docker on the Win directly, or it might destory the environment of your computer. 

I know you guys don't want to completely change your computer into linux (by completely reinstalling the computer). 

So, use the virtual machines on your computer(through Hyper-V) is highly recommended for developing this project.

> Attention! Developers on Win!

---

##  Before U start the project
To be honest, there are too many details to pay attention to even the most basic configuration of virtual machines and Docker. Here I will only list the steps you must (and recommend) before starting the project, as well as some of the problems that are difficult to find solutions.
### Step 1. Download Hyper-V from Chorme/Edge/Firefox
    Pls search on the internet or even ask GPT, pls donot ask me.
### Step 2. Download .iso file for Ubuntu 22.04.5 Desktop (recommended): 
    https://releases.ubuntu.com/jammy/
Using the .iso you download from the web to creat a virtual machine through Hyper-v. 

Pls, choose "US" for your keyboard !!!

### Step 3. How to adjust the resolution of virtual machine (Ubuntu 22) in Hyper-V:

**Modify the grub file in Ubuntu system**
```
sudo vi /etc/default/grub
```
Find the line GRUB_CMDLINE_LINUX_DEFAULT and modify it to:
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyperv_fb:<width x height>". 
```
Here, change <width x height> to the appropriate resolution of your computer, such as 1920x1080.

Then, run the commands below:
```
sudo update-grub
sudo apt install linux-image-extra-virtual
```
Final step, close the Ubuntu virtual machine.

**Setup Hyper-v**

After closing the Ubuntu virtual machine, you can view the virtual machine name in the Hyper-V Manager. Replacing vm-name with your own virtual machine name.  Replace <2560> <1600> with your own screen resolution, such as 1920x1080.

Start PowerShell in administrator mode and run the following command:

    set-vmvideo -vmname <vm-name> -horizontalresolution:<2560> -verticalresolution:<1600> -resolutiontype single
    
    set-vm <vm-name> -EnhancedSessionTransportType HVSocket 


### Step 4. Install Docker Engine (also docker-compose) on Unbuntu 22.04 (or other linux sys)
    Pls search on the internet or even ask GPT, pls donot ask me.

### Step 5. For Chinese Developers Only
Install Pinyin input method through Fcitx5 in Ubuntu and set it to start automatically at boot

    Pls search on the internet or even ask GPT, pls donot ask me.

## Build and Run (PLS "cd" to the folder: Website/)

**Check Doker Container**

    sudo docker ps

**Run with Docker Compose:**

    Start all services using docker-compose (I prefer the first one):
    
    sudo docker-compose up --build
    
    sudo docker-compose up -d

**Force rebuild all services and start**  
```bash
sudo docker-compose up --build -d
```

**Stop with Docker Compose:**

    sudo docker-compose down


## Access Services:

Frontend: 

    http://localhost:8080

Backend: 

    http://localhost:4000

mysql: 

    http://localhost:8081

##  Contact Details

Dankao Chen:

    zczqdc2@ucl.ac.uk
    
    dankaochen2002@gmail.com
