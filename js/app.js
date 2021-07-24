//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//eventos 
eventListeners()

function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//Clases 
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();

    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //Se extraen lo valores
        const { presupuesto, restante } = cantidad;

        //Se insertan los valores en el html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === "error") {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //mensaje
        divMensaje.textContent = mensaje;

        //Insertar en el html

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quiter mensaje 
        setTimeout(() => {
            divMensaje.remove()
        }, 3000)
    }

    mostrarGastos(gastos) {

        this.limpiarHTML()
        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            //agragar al html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class = "badge badge-primary badge-pill"> $ ${cantidad} </span>`;
            //boton para borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //  agregar al html
            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');


        if ((presupuesto / 4) > restante) {//si supera el 75% del presupuesto el color se pasa a rojo
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {//si supera el 50% del presupuesto el color se pasa a amarillo
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {//se restablece el color a medida que se borran gastos
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado!', 'error');
            //si se agota el presupuesto se deshabilita el boton para agregar gastos
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}






//intancias
const ui = new UI();
let presupuesto;

//Funciones 

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

}

//agraga los gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validacion de campos vacios
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");

        return

    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no valida", "error");

        return
    }

    //objeto gasto 
    const gasto = { nombre, cantidad, id: Date.now() }


    //agregar gasto
    presupuesto.nuevoGasto(gasto);

    //mensaje success   
    ui.imprimirAlerta("Gasto agregado correctamente");

    const { gastos, restante } = presupuesto;
    //Agrear los gastos al listado
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto)
    //reiniciar formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //elimina del objeto
    presupuesto.eliminarGasto(id);
    //elimina gastos del html
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto)
}