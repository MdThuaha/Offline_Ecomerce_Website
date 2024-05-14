$(() => {
    let db;
    const request = indexedDB.open("db1279757");
    request.onerror = (event) => {
      console.error("Oops! There was a problem accessing the IndexedDB storage.");
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      findData(db);
       
    };
    /////////////////////////////////////
    $(document).on("click", "button.btn-cart", function () {
      var cart = [];
      var cartdata = localStorage.getItem("cart-data");
      if (cartdata) {
        cart = JSON.parse(cartdata);
      }
      let item = cart.find(x=> x.id == $(this).data('id'));
      if(item){
        item.qty += 1;
      }
      else
      {
        item = {id: $(this).data('id'), name: $(this).data('name'), price: $(this).data('price'), qty:1}
        cart.push(item);
      }
      console.log(item);
      localStorage.setItem("cart-data", JSON.stringify(cart));
      $('#count').html(countCartItem().toString());
    });
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
  function findData(db){
    const trx = db.transaction(["products"],"readonly");
        const store = trx.objectStore("products");
        const cursor = store.openCursor()
        .onsuccess = (event)=>{
            const pointer = event.target.result;
            if(pointer){
                console.log (pointer.value.name);
                console.log (pointer.value.price);
                console.log (pointer.value.description);
                $('#products').append(`<div class="box">
                        <img src="${pointer.value.picture}" />
                        <div class="name">${pointer.value.name}</div>
                        <div style="text-align: right;">Price: <span class="price">${pointer.value.price}</span></div>
                        <div class="desc"  style="height:110px;">${pointer.value.description}</div>
                        <div class="add"><button data-id="${pointer.value.id}" data-price="${pointer.value.price}" 
                          data-name="${pointer.value.name}" class="btn-cart"><i class="fa fa-shopping-cart"></i> Add to cart</button></div>
                    </div>`);
                pointer.continue();
            }
        };
  }
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