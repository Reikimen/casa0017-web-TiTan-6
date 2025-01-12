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



Though in a lab environment, team collaboration can be achieved by deploying the environment on one of the Raspberry Pi's and using it together for their collaborative development. However, such an approach relies too much on off-line, forcing all members to be in the same working space. Moreover, in the unfortunate event that a device breaks, the development team may be faced with the dilemma of redeploying the development environment, despite the support of the archive on GitHub.

Docker, on the other hand, has several significant benefits in front-end and back-end (including database) projects as follows, which is why the development team adopted Docker for this project:

#### 1. **Environmental Consistency**

- **Problem**: Team members may have different development environments (operating systems, dependency versions, etc.), which can easily lead to the phenomenon of ‘it's fine on my computer’.
- **Solution**: With Docker, everyone can run the same container environment (including operating system, software version, etc.) to ensure consistency.

#### 2. **Simplified Deployment**

- **Problem**: Manual deployment requires configuring multiple environments (database, back-end services, front-end), which is a tedious and error-prone process.
- **Solution**: Docker provides an independent environment, and you only need to run `docker-compose up` when the project starts.

#### 3. **ISOLATION** **SOLUTION**

- **Problem**: There may be other services running locally (e.g. different versions of Node.js, MySQL), which are prone to conflict.
- **Solution**: Docker containers are independent of each other, and different services run in their own isolated environment.

#### 4. **Quick startup and rebuild environment**

- **Problem**: It takes time to configure the environment when new members join.

- **Solution**: New members can quickly run projects via Docker by simply installing Docker and pulling the project code.

  

```plaintext
Repo-Structure/
├── Group Report/                # Documents or reports for the project
├── Website/                     # Main application folder
│   ├── backend/                 # Backend application code
│   │   ├── node_modules/        # Node.js dependencies
│   │   ├── .env                 # Environment variables
│   │   ├── Dockerfile           # Dockerfile for backend
│   │   ├── package.json         # Backend dependencies and scripts
│   │   └── server.js            # Main backend server file
│   ├── frontend/                # Frontend application code
│   │   ├── css/                 # Stylesheets
│   │   │   └── styles.css       # Main stylesheet
│   │   ├── img/                 # Images for the frontend
│   │   ├── js/                  # JavaScript files
│   │   │   └── map.js           # Frontend logic for map functionality
│   │   ├── index.html           # Main landing page
│   │   └── login.html           # Login page
│   ├── mysql/                   # Database setup
│   │   ├── data/                # Database data files (if applicable)
│   │   ├── init/                # Initialization scripts for the database
│   │   │   └── init.sql         # SQL initialization script
│   ├── nginx/                   # Nginx configuration files
│   │   ├── sites-enabled/       # Nginx virtual host configurations
│   │   │   └── frontend.conf    # Configuration for the frontend
│   │   └── nginx.conf           # Main Nginx configuration file
│   ├── docker-compose.yml       # Docker Compose configuration
│   └── Notes-for-developers/    # Developer notes or guidelines
├── README.md                    # Project documentation
├── .gitignore                   # Git ignore file
├── LICENSE                      # Project license file
```



The above project structure was designed based on teamwork, development efficiency, system performance, security and user experience from multiple perspectives, and has the following characteristics:

Firstly, front-end and back-end are separated. Front-end and back-end separation helps decouple the front-end (UI/UX) and back-end (logic, data processing), each developed and tested independently, reducing interdependence. Technical flexibility, the front and back ends can use different technology stacks. Reusability, the back-end interface can serve multiple clients at the same time (e.g., Web front-end, mobile apps, etc.), improving code reuse.

Second, using Nginx, a high-performance and lightweight reverse proxy server, can handle a large number of concurrent requests while consuming fewer resources. With its strong static resource handling capability, it is particularly suitable for hosting front-end static resources (HTML, CSS, JavaScript), which can improve access speed.

Finally, although not reflected in the structure of the project, the project makes use of phpMyAdmin for database visualisation. Development members can better get up to speed with SQL and participate in development. It is worth mentioning that in this project, the . /sql/data folder is used to store both project-generated (e.g., new data per dropdown from the Google API) and running (e.g., cumulative updates to user forms) data, and the use of ‘.gitignore’ ensures that only user forms are uploaded to github.

