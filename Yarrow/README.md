# Yarrow
Immersive language learning in VR

| Table of Contents                                                                 |
| ---                                                                               |
| [Overview](#overview)                                                             |
|  - [Features](#features)                                                          |
|  - [Roles](#roles)                                                                |
| [Platform Support](#platform-support)                                             |
|  - [Full Platform Support](#full-platform-support)                                |
|  - [Additional Platforms Supported](#additional-platforms-supported)              |
|  - [Partially Completed Platforms Support](#partially-completed-platform-support) |
|  - [Potential, Untested Platforms](#potential%2C-untested-platforms)              |
|  - [Unsupported Platforms](#unsupported-platforms)                                |
| [Technology](#technology)                                                         |
|  - [Front-End](#front-end)                                                        |
|  - [Editor](#editor)                                                              |
|  - [Server](#server)                                                              |
| [Development](#development)                                                       |

## Overview

Diplomatic Language Services' Virtual Reality project (codename `Yarrow`) is an immersive, web-based, multi-user
experience for training foreign language conversational skills. It is designed around a "guided tour" metaphor,
where an instructor takes 1 or more students through historically or culturally interesting environments, constructed
from 360 degree images and additional pedagogical material, in foreign countries to experience culture and practice
language in a culturally appropriate context.

### Features

The VR experiences support the following features:

 - **Stations** 360 degree imagery, typically captured from Google Street View, for viewing on their own for culture details and discussion points, as well as collecting pedagogical material.
 - **Station connections**: for creating a narrative path through stations.
 - **Environmental audio**: for creating an audioscape in the virtual environment that enhances immersion.
 - **Zones**: for grouping Stations and Environment Audios so that multiple audioscapes may appear as the user traverses the module.
 - **Voiceovers**: for listening tasks that students may perform.
 - **Signs**: image files that are displayed either in-situ or as callouts in the environment. They may be PNG, JPEG, or PDF files.
 - **Videos**: links to YouTube videos that get embedded in the environment similar to Signs. Currently, only 2D videos are used in any particular module, but support exists for 360 and stereo videos.
 - **Texts**: small text fields that can be used for highlighting vocabulary words or add additional information.
 - **3D Models**: Models in the GLTF or GLB formats that can be placed in the environment for extra detail. Currently, this feature is not used.

### Roles

 - **Students** only have access to the front-end.
    - Students can access the site anonymously, or sign up for an account.
    - Students with an account can have their completion of pedagogical material tracked as Reports in the back-end.
    - A student's own laser pointer always appears white to themselves.
    - Other students' laser pointers appear as yellow to other users.
 - **Instructors** only have access to the front-end.
    - Instructors have a slightly different avatar representation from students.
        - They have an emoji star placed next to their name, and
        - Their laser pointer appears as a different color (green) from students.
    - Instructors can access the site anonymously, or sign up for an account.
 - **Headsets** are a special type of user that represent an individual Meta Quest 2 headset.
    - Users can have Headsets assigned to them.
    - When a User has a Headset assigned to them, accessing the VR site with that Headset will allow the Headset to impersonate that User.
    - In other words, as long as the Headset's browser cache does not have its cookies cleared, the User will not have to enter login information to access their Organizations data or have their activity tracked.
 - **Editors** have partial access to the back-end. They can:
    - View Scenarios assigned to the same Organization as they are.
    - Create Languages,
    - Create Scenarios,
    - Edit the layout of Scenarios, and
    - Edit the Menu that their organization will see to access their scenarios,
    - Publish scenarios.
 - **Managers** have partial access to the back-end. They can:
   - View Users within the same Organization as they are.
   - View Lesson Activity Reports for those Users
 - **Admins** have nearly full access to the back-end. They have all the permissions of Editors and Managers, with the addition that they can
   - Create Organizations,
   - Create new Users,
   - Assign Users to Roles,
   - Assign Scenarios to Organizations, and
   - View the Scenarios and Menus of all Organizations.
 - **Developers** have full Admin access, plus some small features,
   - Access to a "Test" section of the site that included in-development demos of libraries and new tools.
   - Access to modify settings that control some of the behavior of the WebRTC system.

## Platform support

### Full platform support

The project currently supports as first-class targets:

 - **Meta Quest 2** and **Meta Quest Pro** headsets with **Meta Browser**.
 - **Desktop computers** with **Chromium-based browsers** (Google Chrome, Microsoft Edge, etc.). This can be done in
    - Standard mouse-and-keyboard mode, or,
    - With a VR headset (though software defects in Chrome often cause the feature to be unavailable)
        - Meta desktop-capable headsets, such as the Rift S, Quest 2 with Link Cable, and Quest Pro with Link Cable.
        - Microsoft Mixed Reality headsets, such as the Samsung Oddyssey+, HP Reverb G2, etc.
        - SteamVR headsets such as the HTC Vive and Valve Index.
 - **Android mobile devices** with **Chromium-based browsers** for touch-screen/magic window interactions.

### Additional platforms supported

The project should work with the following targets, but we don't test as frequently, so occasionally regressions occur:

 - **Meta Quest 2** with **Igalia Wolvic** browser.
 - **Desktop computers** with **Mozilla Firefox** browser. Mozilla Firefox no longer has any support for VR on desktop computers.
 - **MacOS desktop computers** with **Safari** browser. MacOS *may* have support for some SteamVR headsets, but this is untested.
 - **Android mobile devices** with **Mozilla Firefox** browser. 

### Partially completed platform support

The project has partial, unfinished support for the following targets. Some functionality may work, but the application is unstable and will frequently show aberrant behavior or crash completely:

 - **iOS mobile devices (iPhones and iPads)** with Safari browser.
 - **Microsoft HoloLens 2** with Microsoft Edge browser.

### Potential, untested platforms

The project may work with the following targets, though they are currently untested:

 - **Pico Neo** headsets with Igalia Wolvic browser.
 - **HTC Vive Focus** headsets with Igalia Wolvic browser.
 - **Magic Leap 2** headsets with Magic Leap Web Browser.

### Unsupported platforms.

The project does not work and has no plans to ever work for the following targets, as they lack fundamental features that prevent basic operation.

 - **Meta Quest 2** with **Mozilla Firefox Reality** browser.
 - **Meta Quest 1** headsets with Meta Browser of Igalia Wolvice.
 - **Meta Go** headsets with any browser.
 - Any desktop or Android mobile device with a browser that heavily modifies Chromium (e.g. Brave, Samsung Internet)
 - iOS mobile devices with any browser other than Safari.
 - **Microsoft HoloLens 1** devices with Microsoft Edge browser.

## Technology

### Front-end

The user-facing software leverages the following technologies and libraries.

 - **WebXR** is a Web Standard interface for accessing virtual- and augmented reality device motion data, displays, and hand tracking. It enables achieving full, virtual immersion without having to install an application on the client device. The application is deployed through a standard Web Application server, with no need to submit for approval to any platform-dependent app store.
 - **WebAudio** is a Web Standard interface for real-time manipulation of audio streams. WebAudio enables spatialization of audio sources to create audioscapes that enhance the feeling of immersion within the application environment. It also allows us to filter basic audio tracks for diverse, complex effects, like adding echoes, making music sound like it's coming from a radio, or making road noises sound like they're coming from outside a building.
 - **WebRTC** is a Web Standard interface for teleconferencing. It enables sharing audio, video, and data streams between users in the application together. We primarily support audio for users to be able to speak to each other, as well as transmitting VR headset and controller poses for body language on avatars in the environment. There is provisional support for webcam video feeds to allow desktop and mobile device users to add their face to their avatar.
 - **WebGL** is a Web Standard interface for accessing GPU-accelerated graphics rendering capabilities. The project does not interface with WebGL directly, opting to use the popular Three.js library.
 - **Three.js** is a 3rd party library for managing graphics primitives and scene graph structures. It enables us to work in high-level concepts of models, materials, textures, and relationships between objects.
 - **Juniper** is a 1st party library (developed by Sean T. McBeth), for providing an application-oriented interface for developing immersive experiences through web browsers. It combines Three.js, WebXR, WebAudio, and WebRTC into a common Environment concept that abstracts away many low-level details to enable VR experience development appear more like traditional, GUI software development.
 - **PDFJS** is a 3rd party library from rendering PDF documents into images. PDFJS enables using PDF files as media assets in the virtual environment, with full support for pagination.

### Editor

In a restricted access section of the site, the project has a suite of tools for managing data that gets deployed to users in the front end. The primary tool in that suite is the Layout Editor, which is used to construct the individual modules that students experience in the front end. In addition to the features utilized by the front-end (with the exception of WebRTC), the Layout Editor also leverages the following technologies.

 - **Google Maps JavaScript API** provides a map view on which to search for points of interest to include as 360 degree images in the language training modules.
 - **Google Maps Static Street View API** provides a system for downloading rectangular snapshots into Street View 360 degree images. The Editor Layout software then reconstructs a series of many of these images into a Photosphere image, encoded as an Cubemap image.
 - **Google Maps Places API** provides text search capability to help find points of interest in the world.
 - **Google Maps Elevation API** provides terrain elevation data so that individual stations in a module can be placed in realistic, 3-dimensional relationship to each other, so that distant avatars and sounds look and sound like they are coming from the "correct" direction.

### Server

The server that houses and makes all of this available is located on a Microsoft Azure virtual machine running the Ubuntu Linux operating system.

 - **Kestrel** is the Web server software that takes HTTP connections and serves content to the user.
 - **ASP&period;NET Core** is the Web Application framework used to manage requests and responses through Kestrel.
 - **Juniper** is a 1st party library (developed by Sean T. McBeth), for providing build tools, common server configuration patterns, and media manipulation tools for the application.
 - **YT-DLP** (https://github.com/yt-dlp/yt-dlp) is a 3rd party application for scraping details of video site links to enable proxying the media streams through the Yarrow server. Currently, we only utilize YT-DLP's YouTube support.
 - **FFmpeg** (https://ffmpeg.org/) is a 3rd party application from manipulating audio and video files.
 - **CoTURN** (https://github.com/coturn/coturn) is a WebRTC TURN (Traversal Using Relay Nodes) server for enabling WebRTC connections between peers behind restrictive corporate firewalls.
 - **PostgreSQL** (https://www.postgresql.org/) is a RDBMS (Relational Database Management System) that houses all of the data that comprise our VR lesson modules.
 - **Entity Framework Core** is a ORM (Object-Relational Mapper) for managing schema changes and creating, reading, updating, and deleting data in the PostgreSQL database.

## Development

 - **Visual Studio 2022**
    - **.NET 7.0 SDK**: https://dotnet.microsoft.com/download/dotnet/7.0
    - All server backend code is written in C# 11.
 - **Node.js 16**
    - Install: https://nodejs.org/en/
    - Should be added to path automatically
    - Update: `npm install -g node`
    - Node.js is necessary to run ESBuild.
 - **TypeScript v4.9**: https://www.typescriptlang.org/
    - All front-end and client-side editor code is written in TypeScript, which then gets translated to JavaScript by ESBuild.
 - **ESBuild v0.17**: https://esbuild.github.io/
    - Manages bundling and minification of all TypeScript code.

