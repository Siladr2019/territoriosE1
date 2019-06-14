// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyDXtU0o3Fss7ekGwFSbo4ZtGsovqQCoplE",
  authDomain: "territorios-bcc35.firebaseapp.com",
  databaseURL: "https://territorios-bcc35.firebaseio.com",
  projectId: "territorios-bcc35",
  storageBucket: "territorios-bcc35.appspot.com",
  messagingSenderId: "386589869019",
  appId: "1:386589869019:web:fe23acbaf279584d"
};

// Initialize Firebase
firebase.initializeApp(config);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Definción de eventos para botones de registro y conexión
var reg = document.getElementById("registrar");
reg.addEventListener("click", registrar, false);
var con = document.getElementById("conectar");
con.addEventListener("click", conectar, false);

function registrar() {
  var email = document.getElementById("email1").value;
  var password = document.getElementById("password1").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      confirmar();
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
      $("#modalRegistro").modal('hide');
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function conectar() {
  var email = document.getElementById("email2").value;
  var password = document.getElementById("password2").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Existe usuario activo.");
      contenidosUsuarioRegistrado(user);

      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log('Usuario verificado: ' + emailVerified);
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    } else {
      // User is signed out.
      console.log("No existe ningún usuario con esos datos");
      var contenido = document.getElementById("contenido");
      contenido.innerHTML = `
      <p>Debes conectarte para acceder al panel de usuarios registrados</p>
      `;
    }
  });
}

var fechaHoy = new Date().getFullYear() + "/" + (new Date().getMonth()+1) + "/" + new Date().getDate();

function contenidosUsuarioRegistrado(usuario) {
  var contenido = document.getElementById("contenido");
  if (usuario.emailVerified) {
    contenido.innerHTML = `
      <div class="alert alert-info alert-dismissible fade show mt-3" role="alert">
        <h3 class="alert alert-info">¡Bienvenido ${usuario.email}!</h3>
        <hr>
        <p class="mb-0">Tenemos muchos contenidos exclusivos solo para usuarios registrados</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form action="#">
        <h2>Territorios</h2>
        <p>Todos los datos son obligatorios</p>
        <div class="form-inline">
          <label for="tipo" class="col-sm-3 col-form-label">Tipo<sup>(*)</sup>: </label>
          <input type="number" id="tipo" placeholder="Introduce un tipo de territorio (1 al 10)" class="form-control my-3 col-sm-4" min="1" max="10" required>
        </div>
        <div class="form-inline">
          <label for="territorio" class="col-sm-3 col-form-label">Territorio<sup>(*)</sup>: </label>
          <input type="number" id="territorio" placeholder="Introduce un territorio (1 al 300)" class="form-control my-3 col-sm-4" min="1" max="300" required>
        </div>
        <div class="form-inline">
        <label for="inicio" class="col-sm-3 col-form-label">Fecha inicio<sup>(*)</sup>: </label>
          <input type="date" id="inicio" placeholder="Introduce una fecha de inicio" class="form-control my-3 col-sm-3" max="${fechaHoy}" required>
        </div>
        <div class="form-inline">
          <label for="fin" class="col-sm-3 col-form-label">Fecha fin<sup>(*)</sup>: </label>
          <input type="date" id="fin" placeholder="Introduce una fecha de fin" class="form-control my-3 col-sm-3" max="2019-06-15" required>
        </div>
        <div class="form-inline">
          <label for="cuando" class="col-sm-3 col-form-label">Cuándo se trabaja<sup>(*)</sup>: </label>
          <input type="text" id="cuando" placeholder="Introduce un texto" class="form-control my-3 col-sm-4" maxlenght="50" pattern="[A-Za-zÑñÁÉÍÓúáéíóúÇç\s]" required>
        </div>
        <div class="form-inline">
          <label for="quien" class="col-sm-3 col-form-label">Quién trabaja<sup>(*)</sup>: </label>
          <input type="text" id="quien" placeholder="Introduce un texto" class="form-control my-3 col-sm-4" min="1" max="120" required>
        </div>
      </form>
      <button class="btn btn-info my-3" id="guardar">Guardar</button>
      <div id="act"></div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tipo</th>
            <th scope="col">Territorio</th>
            <th scope="col">Fecha inicio</th>
            <th scope="col">Fecha fin</th>
            <th scope="col">Cuando se trabaja</th>
            <th scope="col">Quien trabaja</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody id="tabla">
        </tbody>
      </table>
    `;
    cargarTabla();
    $("#cerrarconexion").html(`<button id="cerrar" class="btn btn-info">Cerrar sesión</button>`);
    var cer = document.getElementById("cerrar");
    cer.addEventListener("click", cerrar, false);
    var gur = document.getElementById("guardar");
    gur.addEventListener("click", guardar, false);
  } else {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h3 class="alert-heading">¡Bienvenido ${usuario.email}!</h3>
        <p>Activa tu cuenta para ver los contenidos de usuarios registrados</p>
        <hr>
        <p class="mb-0">Revisa tu correo electrónico</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
  }
}

function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      console.log("Saliendo...");
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <strong>¡Hasta otra!</strong> Esperamos verte pronto otra vez por nuestro portal
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
      cerrarconexion.innerHTML = "";
    })
    .catch(function (error) {
      console.log(error);
    });
}

function confirmar() {
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function () {
    // Email sent.
    console.log("Enviando correo...");
  }).catch(function (error) {
    // An error happened.
    console.log(error);
  });
}

function guardar() {
  tipo = document.getElementById("tipo").value;
  territorio = document.getElementById("territorio").value;
  inicio = document.getElementById("inicio").value;
  fin = document.getElementById("fin").value;
  cuando = document.getElementById("cuando").value;
  quien = document.getElementById("quien").value;
  if (tipo.trim() === "" || territorio.trim() === "" || inicio.trim() === "" || fin.trim() === "" || cuando.trim() === "" || quien.trim() === "") {
    alert("Todos los datos son obligatorios");
  } else {
    var usuario = {
      tipo: tipo,
      territorio: territorio,
      inicio: inicio,
      fin: fin,
      cuando: cuando,
      quien: quien
    };

    db.collection("usuarios").add(usuario)
      .then(function (docRef) {
        console.log("Documento escrito con ID: ", docRef.id);
        document.getElementById("tipo").value = "";
        document.getElementById("territorio").value = "";
        document.getElementById("inicio").value = "";
        document.getElementById("fin").value = "";
        document.getElementById("cuando").value = "";
        document.getElementById("quien").value = "";
      })
      .catch(function (error) {
        console.error("Error añadiendo el documento: ", error);
      });
  }
}

// Lectura de los documentos
function cargarTabla() {
  db.collection("usuarios").onSnapshot(function (querySnapshot) {
    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    querySnapshot.forEach(function (doc) {
      tabla.innerHTML += `
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().tipo}</td>
          <td>${doc.data().territorio}</td>
          <td>${doc.data().inicio}</td>
          <td>${doc.data().fin}</td>
          <td>${doc.data().cuando}</td>
          <td>${doc.data().quien}</td>
          <td><div class="btn btn-outline-success" onclick="editarDatos('${doc.id}', '${doc.data().tipo}', '${doc.data().territorio}', '${doc.data().inicio}', '${doc.data().fin}', '${doc.data().cuando}', '${doc.data().quien}');"><i class="fas fa-eraser"></i></div></td>
          <td><div class="btn btn-outline-danger" onclick="borrarDatos('${doc.id}', '${doc.data().tipo}', '${doc.data().territorio}');"><i class="fas fa-edit"></i></div></td>
        </tr>
      `;
    });
  });
}
// var fechaHoy = new Date().getFullYear() + "/" + (new Date().getMonth()+1) + "/" + new Date().getDate() // Esto es para poner en el max en la fecha (que no te permita poner mas fecha que la actual)

// Borrar datos de documentos
function borrarDatos(parId, parTipo, parTerritorio) {
  var re = confirm("¿Está seguro que quiere borrar este usuario: " + parTipo + ' / ' + parTerritorio + ' ' + "?");
  if (re == true) {
    db.collection("usuarios").doc(parId).delete()
      .then(function () {
        console.log("Usuario borrado correctamente.");
      }).catch(function (error) {
        console.error("Error borrando el usuario: ", error);
      });
  }
}

// Editar datos de documentos
function editarDatos(parId, parTipo, parTerritorio, parInicio, parFin, parCuando, parQuien) {
  document.getElementById("tipo").value = parTipo;
  document.getElementById("territorio").value = parTerritorio;
  document.getElementById("inicio").value = parInicio;
  document.getElementById("fin").value = parFin;
  document.getElementById("cuando").value = parCuando;
  document.getElementById("quien").value = parQuien;

  $("#guardar").css("display", "none");
  $(".linea").attr("disabled", true);
  $("#act").append("<button class='btn btn-info my-3' id='actualizar'>Guardar</button>");
  $("#actualizar").on("click", function () {
    var userRef = db.collection("usuarios").doc(parId);
    tipo = document.getElementById("tipo").value;
    territorio = document.getElementById("territorio").value;
    inicio = document.getElementById("inicio").value;
    fin = document.getElementById("fin").value;
    cuando = document.getElementById("cuando").value;
    quien = document.getElementById("quien").value;

    if (tipo.trim() === "" || territorio.trim() === "" || inicio.trim() === "" || fin.trim() === "" || cuando.trim() === "" || quien.trim() === "") {
      alert("Todos los datos son obligatorios.");
    } else {
      return userRef.update({
          tipo: document.getElementById("tipo").value,
          territorio: document.getElementById("territorio").value,
          inicio: document.getElementById("inicio").value,
          fin: document.getElementById("fin").value,
          cuando: document.getElementById("cuando").value,
          quien: document.getElementById("quien").value
        })
        .then(function () {
          console.log("Usuario actualizado correctamente.");
          document.getElementById("tipo").value = "";
          document.getElementById("territorio").value = "";
          document.getElementById("inicio").value = "";
          document.getElementById("fin").value = "";
          document.getElementById("cuando").value = "";
          document.getElementById("quien").value = "";
          $("#guardar").css("display", "inline");
          $(".linea").attr("disabled", false);
          $("#act").empty();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error actualizando usuario: ", error);
        });
    }
  })
}

observador();