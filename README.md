# OEElevate

## Running the app

### Requirements and Setup

#### Frontend

Make sure that you have node and npm install. If they're not installed, I recommend using the [instructions on the nodejs website](https://nodejs.org/en/download/package-manager) to install them using **fnm**

After you've installed node:

1. Install pnpm globally by running `npm install -g pnpm`
2. Setup pnpm by running `pnpm setup`
3. Install the Angular CLI tool globably by running `pnpm i -g @angular/cli@17`. Run `ng version` to confirm installation.
4. Navigate to the frontend folder `cd ./frontend`
5. Run `pnpm install` to install all project dependencies

#### Backend

Make sure that you have python3 installed

1. run `python -m venv oee` to initialize a virtual environment
2. source oee/bin/activate
3. pip install -r requirements.txt

### Development

#### Run Frontend for development

Navigate to the `frontend` directory and use `ng serve` or `ng serve --open` to open the app in your browser right away.

#### Run Backend for development

Navigate to the `backend` directory and use `./run.py` to run the backend.

### Build (Frontend)

To build the project so that it is ready for production please run `ng build` in the frontend directory.

Another very important option when building is the `--configuration` option which specifies which build configuration will be used.

There are different build configurations available:

- **production** - For the main production server. Go into [environment.production.ts](./frontend/src/environments/environment.production.ts) and change the `apiUrl` to use your own backend. Example: `{ production: true, apiUrl: "https://kk.tech/api/" }`
- **kk** - For KirollousHany03's production server. Go into [environment.production.ts](./frontend/src/environments/environment.kk.ts) and change the `apiUrl` to use your own backend
- **development** - For development server. `ng serve` automatically uses this configuration
- **localstaging** - For testing deployment locally, before deploying to server.

### Deployment

> ⚠️ Please note that these instructions are for deploying running the application on the **Ubuntu** distro, and the scripts provided are taylored for an **Ubuntu** distro

Before deploying, I recommend removing nginx, just to ensure that it's properly installed. To remove it you can follow the instructions provided by [this post](https://gcore.com/learning/how-to-uninstall-nginx-ubuntu/) or run the script `./remove-nginx` and making sure that the status printed at the end shows `inactive (dead)` or `Unit nginx.service could not be found.`

Now you can run the `./serve` script to serve the whole project using an nginx server with a reverse proxy to the backend.

The `./serve` script uses two scripts:

1. _start-gunicorn_ - Starts the backend in using gunicorn
2. _start-nginx_ - Starts the nginx webserver that serves the landing-page, the frontend, and the backend by proxy

In the `./start-nginx` script, nginx (if not found) is installed by the `./install-nginx` script which follows the instructions for installing nginx on Ubuntu found on [this page](https://nginx.org/en/linux_packages.html) of the nginx docs.

The `./start-nginx` script also uses the `./setup-nginx` to copy any files to their correct directory for the nginx server (such as the nginx configuration `nginx.conf`, files from the angular build at `./frontent/dist/browser`, files for the landing page `./landing-page/*`).
