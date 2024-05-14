$(() => {
    let db;
    const request = indexedDB.open("db1279757");
    request.onerror = (event) => {
      console.error("Oops! There was a problem accessing the IndexedDB storage.");
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      recordproduct(db);
       
    };
    request.onupgradeneeded = (event) => {
      console.log("upgrade");
      // Save the IDBDatabase interface
      db = event.target.result;

      // Create an objectStore for this database
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    ///////////////////////////
    let data = sessionStorage.getItem("login-data");
    let isLoggedIn = false;
    if (data) {
      data = JSON.parse(data);
      isLoggedIn = true;
    }
    if (isLoggedIn) {
      $("#admin").show();
      
      $("#login").hide();
      
    } else {
      $("#admin").hide();
     
      $("#login").show();
    }
    $('#count').html(countCartItem().toString());
  });
  function recordproduct(db) {
     
    let recordCount = 0;

    const trx = db.transaction(["products"], "readonly");
    trx.oncomplete = (event) => {
      console.log(recordCount);
      if (recordCount < 1) {
        Add(db);
      }

      console.log("count done");
    };
    const store = trx.objectStore("products");
    count = store.count();

    count.onsuccess = function () {
      recordCount = count.result;
      
    };
  }
  function Add(db) {
      const transaction = db.transaction(["products"], "readwrite");
      const objectStore = transaction.objectStore("products");
      for (var i = 0; i < initialPetProducts.length; i++) {
        const query = objectStore.add(initialPetProducts[i]);
        query.onsuccess = () => {
          console.log('done');
        };
      }
    };
    function countCartItem(){
    var cart = [];
    var cartdata = localStorage.getItem('cart-data');
    if(cartdata){
      cart = JSON.parse(cartdata)
    }
    let c=0;
    cart.forEach(x => {
      c += Number(x.qty);
    });
    return c;
  }