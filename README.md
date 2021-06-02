# Jaxer

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Jaxer is a server-side Javascript application server that runs
as an Apache module, with syntax similar to ASP on Linux.

Documentation: [https://jaxer.wsd.co.jp/document/](https://jaxer.wsd.co.jp/document/)
Previous Documentation: [https://jaxer.wsd.co.jp/docs/](https://jaxer.wsd.co.jp/docs/)

## Build On Debian 10

These are the instructions for how to build on Debian 10 x86_64. This repository uses
Linode as a build / test environment. 

<!--

```
# apt-get update
# apt-get install -y git vim gcc g++ make zip pkg-config libgtk2.0-dev libidl-dev libxt-dev apache2-dev unixodbc unixodbc-dev

# git clone https://github.com/behdad/pangox-compat.git
# mv pangox-compat /usr/include/pango
```

Ugly patch, Jaxer expects and older version of freetype. I tried a lot of cleaner
ways to add freetype to the build path, but it didn't work. This is an ugly work
around, but it works.

```
# ln -s /usr/include/freetype2/ft2build.h /usr/include/
# ln -s /usr/include/freetype2/freetype /usr/include/
```

Clone and build the repository

```
# cd /opt
# git clone https://github.com/WebServiceDevelopment/Jaxer.git
# cd Jaxer
# cd httpd-2.4.46
# sh configureLinux.sh
# make
# make install
# cd ../server
# python build.py
# cp -fr AptanaJaxer/* /opt/AptanaJaxer
```

And then we should remove the freetype symbolic links as they are no longer needed.

```
# rm -f /usr/include/ft2build.h
# rm -f /usr/include/freetype
```

This will create the Jaxer environment in the **/opt/AptanaJaxer/** folder.
The defaults aren't correct, so we need to make a few changes. These changes
should be fixed in later commits, but that depends on when we track down
where these files are. For now, we'll include how to edit them. 

```
# cd /opt/AptanaJaxer
# vim Apache22/conf/httpd.conf
--- Edit the Following Lines ---
- 206     Require all denied
+ 206     #Require all denied

- 221 DocumentRoot "/opt/AptanaJaxer/Apache22/htdocs/"
+ 221 DocumentRoot "/opt/AptanaJaxer/public"

- 222 <Directory "/opt/AptanaJaxer/Apache22/htdocs/">
+ 222 <Directory "/opt/AptanaJaxer/public">

Append to end of File
+ 508 Include conf/extra/jaxer.httpd.conf
--- End Edit ---

# cp jaxer/confs/jaxer.httpd.conf Apache22/conf/extra
# vim /opt/AptanaJaxer/Apache22/conf/extra/jaxer.httpd.conf
--- Edit the Following Lines ---
Remove from end of file
- 133 Include "${ANCHOR}/local_jaxer/conf/*.httpd.conf"
--- End Edit ---
```

Sometimes the build does not properly generate the server-side
framework, so we force write it with our version from this
repositiory. I think to build the framework the package ```openjdk-11-jre``` 
is required, but we want to try to reduce the number of dependencies,
and any changes to the framework will be done directly, in the folder
anyways.

```
# rm -rf /opt/AptanaJaxer/jaxer/framework
# cp -r /opt/Jaxer/framework /opt/AptanaJaxer/jaxer/
```

Last we can start the server with the command.

```
# sh /opt/AptanaJaxer/scripts/start.sh
```

If everything worked, you can navigate to your server's IP address. 
And you should be greeted with the following screen.

![Jaxer Greeter](https://raw.githubusercontent.com/WebServiceDevelopment/Jaxer/master/images/GreetingScreen.png)

-->

## Mascot

![Jaxer Greeter](https://raw.githubusercontent.com/WebServiceDevelopment/Jaxer/master/images/mascot_sprite.png)

## Disclaimer

The software Jaxer, has not been in active development since 2011, and thus
has not been audited for security issues over that time. The current state
of the project is to allow for the application environment to be built
and tested. This software should not be used in any production or otherwise
senstive environment unless at your own risk. The authors of this application
make no claim to security, and offer no warranty. 
