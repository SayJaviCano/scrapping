/// <reference types="Cypress" />

describe("Srapping fotocaa", () => {
  let paginaActual = 1;
  const datos = [];

  function cargarNuevaPagina() {
    // paginaActual = paginaActual + 1;
    // cy.visit(
    //   "https://www.fotocasa.es/es/comprar/viviendas/san-agustin-del-guadalix/todas-las-zonas/l"
    // );
  }

  function guardarNombres() {
    cy.get(".re-CardPackMinimal-info .re-CardTitle").each((nombre) => {
      const producto = { nombre: nombre.text().replace("\n", "").trim() };
      datos.push(producto);
    });
  }

  function guardarPrecios() {
    cy.get(".re-CardPackMinimal-info .re-CardPrice").each(
      (precio, index, lista) => {
        datos[index + 24 * (paginaActual - 1)].precio = precio
          .text()
          .replace("\n", "")
          .replace("€", "")
          .trim();
      }
    );
  }

  before("Cargar la página", () => {
    cy.visit(
      "https://www.fotocasa.es/es/comprar/viviendas/san-agustin-del-guadalix/todas-las-zonas/l"
    );
    cy.scrollTo("bottom", { duration: 5000 });
  });

  after("Guardar en BBDD", () => {
    cy.log(datos);
    let nuevasLineas = "Nombre; Precio; \n "; // cabecera
    datos.forEach((producto) => {
      nuevasLineas =
        nuevasLineas + producto.nombre + ";" + producto.precio + "\n ";
    });
    cy.writeFile("fotocasa.csv", nuevasLineas);
  });

  it("Scrapping data", () => {
    // for (let i = 1; i < 2; i++) {
    guardarNombres();
    guardarPrecios();
    // }
  });
}); // Cierre de describe
