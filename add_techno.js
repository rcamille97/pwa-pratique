const technonameField = document.querySelector('#techno-name');
const technoDescriptionField = document.querySelector('#techno-description');
const technoUrlField = document.querySelector('#techno-url');
const addTechnoForm = document.querySelector('#add-techno-form');

addTechnoForm.addEventListener('submit', evt => {
    evt.preventDefault();
    
    const payload = {
        id: Date.now(),
        name: technonameField.value,
        description: technoDescriptionField.value,
        url: technoUrlField.value
    }
    console.log(payload);

    fetch('https://us-central1-pwa-technos-camillerubio.cloudfunctions.net/addTechno',  { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          /*'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods': "POST",
          'Access-Control-Allow-Headers': "X-Request-With, content-type"*/
        },
        body: JSON.stringify(payload)
      })
      .then(resp => {
          console.log("POST FETCH => ", + resp);
        console.log(resp);
      })
      // 9.5 Ajouter les données en local lors de la déconnexion
      // Hors ligne le POST échoue
      .catch(error => {
          console.log(error);
        // test si service worker ET "syncManager" existent
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          console.log('SyncManager supported by browser');
          console.log('we are probably offline');
          navigator.serviceWorker.ready.then(registration => {
            // API entre en action lors de la déconnexion puis reconnexion
            // put techno pour sauvegarder en local dans IndexedDB
            return putTechno(payload, payload.id).then(() => {
              // Tague le service de synchronisation pour l'utiliser après
              return registration.sync.register('sync-technos')
            });
          })
        } else {
            // TODO browser does NOT support SyncManager: send data to server via ajax
            console.log('SyncManager NOT supported by your browser');
          }
      })
      .then(() => {
        clearForm();
      })
      .catch(error => console.error(error));
     
      // 9.5 Ajouter les données en local lors de la déconnexion
      // Vide le formulaire
      const clearForm = () => {
        technonameField.value = '';
        technoDescriptionField.value = '';
        technoUrlField.value = '';
        technonameField.focus();
      }; 
})

