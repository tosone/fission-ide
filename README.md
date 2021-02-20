# Fission IDE

## What is Fission?

[Fission](https://fission.io/) is a framework for serverless functions on Kubernetes.
Write short-lived functions in any language, and map them to HTTP requests (or other event triggers).

Deploy functions instantly with one command. There are no containers to build, and no Docker registries to manage.

## What is Fission-IDE?

Previously, when we created the Fission function, we had to publish it through fission-cli, and there were many complex parameters. Fission-IDE allows us to publish and manage functions in VSCode. What excites us is that functions can also be debugged in Fission-IDE.

### Setting

First of all, you must set up the corresponding API server for Fission, which is the address of the Fission controller exposed outside the Kubernetes cluster.

<img src="https://media.githubusercontent.com/media/tosone/fission-ide/main/doc/images/setting.png" alt="setting" height="200px">

### Manage Fission Resource

You can manage Function, Environment and Package in VSCode SideBar.

<img src="https://media.githubusercontent.com/media/tosone/fission-ide/main/doc/images/sidebar.png" alt="sidebar" height="600px">

### Deploy Function

Deploy Function by context menu in the file edit area and select 'Fission Function Deploy'. You can also deploy Function from the context menu in the file browsing area.

<img src="https://media.githubusercontent.com/media/tosone/fission-ide/main/doc/images/deploy-file-1.png" alt="deploy-file" height="500px">
<img src="https://media.githubusercontent.com/media/tosone/fission-ide/main/doc/images/deploy-file-2.png" alt="deploy-file" height="500px">

You can see a new button on the VSCode status-bar, its function will be to deploy the folder to Fission.

<img src="https://media.githubusercontent.com/media/tosone/fission-ide/main/doc/images/deploy-dir.png" alt="deploy-file" height="500px">

After that you can deploy the function!

![deploy](https://media.githubusercontent.com/media/tosone/fission-ide/main/doc/images//deploy.png)

Finally, a file will be generated that contains all the information of the current deployment, which is called `.fission.json`, the configuration in this file will be read again when the next deployment.

![config](https://media.githubusercontent.com/media/tosone/fission-ide/main/doc/images//config.png)

## TODO

Although Fission-IDE already has some features, there is a lot of work to do. Please help us to complete this great project. You can check [here](https://github.com/tosone/fission-ide/blob/main/TODO.md) get where Fission-IDE needs to work, of course you can also look for TODO tag in the code to help us improve it.
