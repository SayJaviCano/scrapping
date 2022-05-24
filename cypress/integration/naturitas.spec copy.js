/// <reference types="Cypress" />
require("cypress-xpath"); // Cuando se utilice el xpath como selector

describe("Srapping", () => {
  let paginaActual = 1;
  const datos = [];

  function cargarNuevaPagina() {
    paginaActual = paginaActual + 1;
    cy.visit("https://www.naturitas.es/c/suplementos?p=" + paginaActual);
  }

  function guardarNombres() {
    cy.get(".product-item-name").each((nombre) => {
      cy.log(nombre.text());
      const producto = { nombre: nombre.text().replace("\n", "").trim() };
      datos.push(producto);
    });
  }

  function guardarPrecios() {
    cy.get(".product-item-price .special-price").each(
      (precio, index, lista) => {
        datos[index + 24 * (paginaActual - 1)].precio = precio
          .text()
          .replace("\n", "")
          .replace("€", "")
          .trim();
        if (lista.length == index + 1) {
          cargarNuevaPagina();
        }
      }
    );
  }

  before("Cargar la página", () => {
    cy.visit("https://www.naturitas.es/c/suplementos");
    cy.get(".cookie-consent-popup__accept-button").should("be.visible").click();
    cy.get(".mfp-close").click();
  });

  after("Guardar en BBDD", () => {
    cy.log(datos);

    let nuevasLineas = "Nombre; Precio; \n "; // cabecera
    datos.forEach((producto) => {
      nuevasLineas =
        nuevasLineas + producto.nombre + ";" + producto.precio + "\n ";
    });

    cy.writeFile("naturitas.csv", nuevasLineas, "utf-8");
  });

  // Hacer mejora para que no se rompa cuando llegue a la última página
  it.only("Scrapping data", () => {
    for (let i = 1; i < 2; i++) {
      guardarNombres();
      guardarPrecios();
    }
  });
}); // Cierre de describe
