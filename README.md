---
typora-root-url: ./Img
---

# UCL Accommodation Finder

CASA0017 Web Assessment ReadMe File - Group Titan 6's



## Our valuable Contributors👩‍💻👨‍💻 :

<a href="https://github.com/Reikimen/casa0017-web-TiTan-6/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=Reikimen/casa0017-web-TiTan-6" />
</a>



## Why we are working on Such project? (Background & Motivation)

The idea for this project comes from our group members' similar personal experiences of new students at UCL - for students from other regions or countries, unfamiliarity with the new environment, coupled with misleading advertisements from specific real estate agents, can lead to poor housing decisions and difficulty in finding suitable walking routes for commuting. Therefore, we want to provide convenient commuting guidance for all (new) students, assisting them in selecting appropriate accommodations and commuting routes. 

The primary target audience for this project was identified as new students at UCL. All data collection and UI design were specifically tailored to students in the London area, aiming to simplify the accommodation search process by integrating accurate housing options and essential commuting information. Hopefully, this proactive approach enhances their overall university experience and academic performance. Developing a functional guidance webpage is the most cost-effective solution to achieve this goal. 



## What we Made?

The ‘UCL Apartment Helper’ web application developed by CASA Titan 6 enables UCL students to find suitable accommodation that is close to the UCL campus, and provides recommendations for walking commuting routes. The project integrates with Google Maps and other APIs to obtain dynamic data, calculate routes and display detailed information about accommodation and campus buildings. The front-end adopts a simple and intuitive interface design. The back-end successfully realising the complete functional chain of data and user interaction, which significantly improves the user's decision-making efficiency and experience. 



# Intro of our Website

## A Concise User's Guide

### Default Page

When a users clicks on the website, the main content of the web page is displayed as shown below before any action is taken:

<img src="/Default-page.png" alt="Default-page" style="zoom: 67%;" />



### Recommend student accommodation

After the user selects the UCL building they want to use as a commuting location and limits the commuting time, the webpage prompts you with some recommended UCL student accommodation.

<img src="/Building-Selected.png" alt="Building-Selected" style="zoom:67%;" />



### Recommend walking commute route

After selecting a flat and commuting location (UCL building), the user is given a recommended walking commute to school.

<img src="/recommended-route.png" alt="recommended-route" style="zoom:67%;" />



### Overall Web Page

Additionally, as the project is explicitly developed for UCL students, a secondary page navigation was included in the header to allow users to input their UCL student account. This feature is designed to facilitate future functionality expansion. 

<img src="/final-web.png" alt="final-web" style="zoom:42%;" />

Only if this project gains support from UCL administration and access to the student information database is provided, the function of the webpage can be further enhanced to deliver personalised services tailored to the needs of each UCL student.



## Future Works

Although through the efforts of each member of the team, and even extremely painful integration and collaboration, the project finally succeeded in achieving the front and back-end database linkage, very beautiful UI design, and the implementation of all the functions planned at the beginning of the project. 

However, there are still the following areas that can be continuously improved in the future: 

```c++
1. More user-friendly, more beautiful UI/UX design.

2. Responsive design: Improve the adaptability of the website to different devices, including a better mobile experience. Optimise the image resolution for retina screens to provide higher definition visual effects.

3. Internationalisation support: Add multi-language support (i18n) to facilitate access and use by international users.

4. Access to UCL's user system, website access through UCL account.

5. Use some very practical gadgets to limit illegal traffic access, to prevent the server from being attacked, for example: "Are you Robot".

6. Improve the framework of Docker migration and deployment, so that the front and back end data transmission is more fluent, more efficient deployment.
```

In the future, we will continue to improve our site as well as conditions allow, allowing more UCL students to move into the halls of preferred residence.



# For Developers (Dockerbase-release ver)

Although the framework built with Docker was working perfectly well, the front-end developer thought it would make sense to use ‘connection’ to connect to the database, but the back-end was accessing the database using ‘Pool’.  As a result, the development team's attempts to migrate the project were not very successful and resulted in a lot of rewriting of code. Unfortunately, this also resulted in the project framework not being compatible with the hard work of the back-end developers (after all, time was running out). 

So our development team has released two versions of the project, the first with ‘Local Deployment’ ( for details refer to the team's report, thanks to Tina and kk, where they mention the development steps in quite a bit of detail) -- This is also the way in which the web design above is achieved.

The other is a release with a ‘Docker’ tag, which makes it easy to participate in the development of our project according to the following guidelines. Although in the end the full features of the entire project were not fully reproduced due to the short development cycle - there is plenty of reason to believe that collaboration using Docker is the way forward for this project.



## Why Docker?

Though in a lab environment, team collaboration can be achieved by deploying the environment on one of the Raspberry Pi's and using it together for their collaborative development. However, such an approach relies too much on off-line, forcing all members to be in the same working space. Moreover, in the unfortunate event that a device breaks, the development team may be faced with the dilemma of redeploying the development environment, despite the support of the archive on GitHub.

### Benefits of Docker

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



## Repo Structure

The project structure was designed based on from multiple perspectives - teamwork, development efficiency, system performance, security and user experience:

```plaintext
main-folder/
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

It has following characteristics:

- Firstly, front-end and back-end are separated. Front-end and back-end separation helps decouple the front-end (UI/UX) and back-end (logic, data processing), each developed and tested independently, reducing interdependence. Technical flexibility, the front and back ends can use different technology stacks. Reusability, the back-end interface can serve multiple clients at the same time (e.g., Web front-end, mobile apps, etc.), improving code reuse.

- Second, using Nginx, a high-performance and lightweight reverse proxy server, can handle a large number of concurrent requests while consuming fewer resources. With its strong static resource handling capability, it is particularly suitable for hosting front-end static resources (HTML, CSS, JavaScript), which can improve access speed.

- Finally, although not reflected in the structure of the project, the project makes use of phpMyAdmin for database visualisation. Development members can better get up to speed with SQL and participate in development. It is worth mentioning that in this project, the . /sql/data folder is used to store both project-generated (e.g., new data per dropdown from the Google API) and running (e.g., cumulative updates to user forms) data, and the use of ‘.gitignore’ ensures that only user forms are uploaded to github.



##  Before U start the project

### Step 0. Read me first

To be honest, there are too many details to pay attention to even the most basic configuration of virtual machines and Docker. Here I will only list the steps you must (and recommend) before starting the project, as well as some of the problems that are difficult to find solutions.

> Attention! Developers on Win!

As Docker is mandatory required for this project, u need to download Docker on your Computer(Laptop). But pls donot install Docker on the Win directly, or it might destory the environment of your computer. 

I know you guys don't want to completely change your computer into linux (by completely reinstalling the computer). 

So, use the virtual machines on your computer(through Hyper-V) is highly recommended for developing this project.

> Attention! Developers on Win!

---



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

Usefull 

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



## Running Successfully:

![docker-based-framework](/docker-based-framework.png)





