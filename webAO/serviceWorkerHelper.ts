function init_service() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/service-worker.js", { scope: "/" })
            .then(function () {
            console.log("Service Worker Registered");
        });
    }
}

init_service()