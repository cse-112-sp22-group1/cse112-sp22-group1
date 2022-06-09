/* eslint-disable */
import * as localStorage from "../localStorage/userOperations.js";
import {adderDropdown, creationMenu} from "../index.js";
import { currentState } from "../state/stateManager.js";
import { router } from "../state/router.js";

export let creationDropdownContents = {
    "index": [
        {
            title: "New Future Log",
            icon: "../public/resources/futureLog.png",
            listener: () => {
                creationMenu.setKind("futureLog");
                creationMenu.show();
            }
        }, {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("collection");
                creationMenu.show();
            }
        }
    ],

    "futureLog": [
        {
            title: "New Monthly Log",
            icon: "../public/resources/monthlyLog.png",
            listener: () => {
                creationMenu.setKind("monthlyLog");
                creationMenu.show();
            }
        }, {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("collection");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon:"../public/resources/task_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ],

    "monthlyLog": [
        {
            title: "New Daily Log",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("dailyLog");
                creationMenu.show();
            }
        }, {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("collection");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon: "../public/resources/tracker_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ],

    "dailyLog": [
        {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("dailyLog");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon: "../public/resources/tracker_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ],
    "collection": [
        {
            title: "New Collection",
            icon: "../public/resources/todaysLog.png",
            listener: () => {
                creationMenu.setKind("collection");
                creationMenu.show();
            }
        }, {
            title: "New Goal",
            icon: "../public/resources/tracker_icon.png",
            listener: () => {
                creationMenu.setKind("tracker");
                creationMenu.show();
            }
        }
    ]

};

export let editDropdownContents = {
        "futureLog": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
                if (confirm("You sure you want to delete this Future Log? This is irreversible")) {
                    console.log("here now")
                    localStorage.deleteFutureLog(currentState, true, (err) => {
                        console.log("somethign has been done");
                        if (err) {
                            console.log(err);
                        } else {
                            adderDropdown.hide();
                            router.navigate("/");
                        }
                    })
                }
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ],

    "monthlyLog": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
                if (confirm("You sure you want to delete this Monthly Log? This is irreversible")) {
                    console.log("here now")
                    localStorage.readUser((err,user) =>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            let logParent = user.futureLogs[0];
                            for (let i = 0; i < user.futureLogs.length; i++) {
                                if(user.futureLogs[i].id === currentState.parent){
                                    logParent = user.futureLogs[i];
                                }
                            }
                            localStorage.deleteMonthlyLog(currentState, logParent, true, (err) => {
                                console.log("somethign has been done");
                                if (err) {
                                    console.log(err);
                                } else {
                                    adderDropdown.hide();
                                    router.navigate("/futureLog/" + logParent.id);
                                }
                            })
                        }
                    })
                }
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ],
    "dailyLog": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
                if (confirm("You sure you want to delete this Daily Log? This is irreversible")) {
                    console.log("here now")
                    localStorage.readUser((err,user) =>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            let logParent = user.monthlyLogs[0];
                            for (let i = 0; i < user.monthlyLogs.length; i++) {
                                if(user.monthlyLogs[i].id === currentState.parent){
                                    logParent = user.monthlyLogs[i];
                                }
                            }
                            localStorage.deleteDailyLog(currentState, logParent, true, (err) => {
                                console.log("somethign has been done");
                                if (err) {
                                    console.log(err);
                                } else {
                                    adderDropdown.hide();
                                    router.navigate("/monthlyLog/"  + logParent.id);
                                }
                            })
                        }
                    })
                }
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ],
    "collection": [
        {
            title: "Delete",
            icon: "../public/resources/delete_icon.png",
            listener: () => {
                if (confirm("You sure you want to delete this Collection? This is irreversible")) {
                    console.log("here now")
                    localStorage.readUser((err,user) =>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(currentState.parent){
                                let logParent;
                                let parentType = "";
                                for (let i = 0; i < user.collections.length; i++) {
                                    if(user.collections[i].id === currentState.parent){
                                        logParent = user.collections[i];
                                        parentType = "collection";
                                    }
                                }
                                if(!logParent){
                                    for (let i = 0; i < user.dailyLogs.length; i++) {
                                        if(user.dailyLogs[i].id === currentState.parent){
                                            logParent = user.dailyLogs[i];
                                            parentType = "dailyLog";
                                        }
                                    }
                                }
                                if(!logParent){
                                    for (let i = 0; i < user.monthlyLogs.length; i++) {
                                        if(user.monthlyLogs[i].id === currentState.parent){
                                            logParent = user.monthlyLogs[i];
                                            parentType = "monthlyLog";
                                        }
                                    }
                                }
                                if(!logParent){
                                    for (let i = 0; i < user.futureLogs.length; i++) {
                                        if(user.futureLogs[i].id === currentState.parent){
                                            logParent = user.futureLogs[i];
                                            parentType = "futureLog";
                                        }
                                    }
                                }
                                console.log(logParent)
                                localStorage.deleteCollection(currentState, logParent, true, (err) => {
                                    console.log("somethign has been done");
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        adderDropdown.hide();
                                        router.navigate("/" + parentType + "/" + logParent.id);
   
                                    }
                                })
                            }
                            else{
                                console.log(logParent)
                                localStorage.deleteCollectionByID(currentState.id, true, (err)=>{
                                    console.log("somethign has been done");
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        adderDropdown.hide();
                                        router.navigate("/");
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }, {
            title: "More",
            icon: "../public/resources/more_icon.png",
            listener: () => {
                
            }
        }
    ]
}

/* eslint-enable */
