import * as localStorage from "../localStorage/userOperations.js";
import { adderDropdown, creationMenu } from "../index.js";
import { refreshIndex } from "../state/setupIndex";
import { router } from "../state/router.js";
export let bindDropdown = (IndexReference) => {
    console.log(IndexReference.log);
    if (IndexReference.log) {
        IndexReference.editDropdownContents = {
            "futureLog": [
            {
                title: "Delete",
                icon: "../public/resources/delete_icon.png",
                listener: () => {
                    if (confirm("You sure you want to delete this Future Log? This is irreversible")) {
                        console.log("here now")
                        localStorage.deleteFutureLog(IndexReference.log, true, (err) => {
                            console.log("somethign has been done");
                            if (err) {
                                console.log(err);
                            } else {
                                adderDropdown.hide();
                                refreshIndex();
                            }
                        })
                    }
                }
            }, {
                title: "More",
                icon: "../public/resources/more_icon.png",
                listener: () => {
                    creationMenu.setKind("futureLog");
                    creationMenu.create.innerText = "Edit";
                    creationMenu.showEdit(IndexReference.log, true);
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
                        localStorage.readUser((err, user) =>{
                            let logParent;
                            if (err) {
                                console.log(err);
                            } else if (IndexReference.log.parent) {
                                    for (let i = 0; i < user.collections.length; i++) {
                                        if (user.collections[i].id === IndexReference.log.parent) {
                                            logParent = user.collections[i];
                                        }
                                    }
                                    if (!logParent) {
                                        for (let i = 0; i < user.dailyLogs.length; i++) {
                                            if (user.dailyLogs[i].id === IndexReference.log.parent) {
                                                logParent = user.dailyLogs[i];
                                            }
                                        }
                                    }
                                    if (!logParent) {
                                        for (let i = 0; i < user.monthlyLogs.length; i++) {
                                            if (user.monthlyLogs[i].id === IndexReference.log.parent) {
                                                logParent = user.monthlyLogs[i];
                                            }
                                        }
                                    }
                                    if (!logParent) {
                                        for (let i = 0; i < user.futureLogs.length; i++) {
                                            if (user.futureLogs[i].id === IndexReference.log.parent) {
                                                logParent = user.futureLogs[i];
                                            }
                                        }
                                    }
                                    console.log(logParent)
                                    localStorage.deleteCollection(IndexReference.log, logParent, true, (err) => {
                                        console.log("somethign has been done");
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            adderDropdown.hide();
                                            refreshIndex();
                                        }
                                     })
                                } else {
                                    localStorage.deleteCollectionByID(IndexReference.log.id, true, (err)=>{
                                        console.log("somethign has been done");
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            adderDropdown.hide();
                                            refreshIndex();
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
                    creationMenu.setKind("collection");
                    creationMenu.create.innerText = "Edit";
                    creationMenu.showEdit(IndexReference.log, true);
                }
            }
        ]
    }
    }
}
