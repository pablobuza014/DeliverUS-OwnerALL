# DeliverUS - Project Requirements

## Introduction
DeliverUS is a made-up company whose business is focused on delivering food from 3rd parties (restaurants) to customers. To this end, we are requested to develop the needed software products which hopefully will boost the company. After interviewing the product owners and some stakeholders, the general objectives and requirements have been agreed, as described in this document.

Check https://github.com/IISSI2-IS-2022-2023/Deliverus-Backend-2022-2023/blob/main/README.md for full DeliverUS app requirements.

# Frontend deployment steps:
1. Clone this repository at your local development environment by opening VScode and clone it by opening Command Palette (Ctrl+Shift+P or F1) and `Git clone` this repository, or using the terminal and running
```PowerShell
git clone <url>
```
It may be necessary to setup your github username by running the following commands on your terminal:
```PowerShell
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```
In case you are asked if you trust the author, please select yes.


3. Setup your environment file. As explained in labs, it is needed to create a copy of the `.env.example` file, name it `.env` and include your environment variables values, specially your API_BASE_URL (usually http://localhost:3000 to run the app in the web browser of the same computer).
   * If you want to connect from your mobile device to your backend, http://localhost:3000 will NOT work because the backend is not running on your mobile device. In order to run your frontend on your device follow these steps:
     * Check your backend server ip by running: `ipconfig` (or `ifconfig` for Linux and MacOS), in home networks it usually follows the 192.168.YYY.XXX pattern.
     * Update the `.env` `API_BASE_URL` property with your backend server ip and port, for instance: http://192.168.YYY.XXX:3000
     * Expo tools caches old `.env` properties' values, so you have to explicitly run the following commands to remove cached values:
       * stop frontend (Ctrl+C)
       * remove `.expo` folder in your project root folder
       * run `expo r -c`
     * NOTE: Everytime you make any modification on your `.env` (for instance, if your backend server IP changes) file you will need to run these steps again.

4. Install dependencies. Run `npm install` to download and install packages to the current project folder.

5. Run your DeliverUS backend app.

6. Run this project (Frontend for owners) by running `npm start`. Follow the instructions in the terminal.