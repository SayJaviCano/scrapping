/// <reference types="Cypress" />

const { PLANET_SALUD } = require("../../credenciales/planet-salud");

require("cypress-xpath");

describe("Añadir descripciones a productos", () => {
  before("Ir a la página y logarse", () => {
    cy.visit(PLANET_SALUD.loginPage);
    cy.get("#input_0").type(PLANET_SALUD.usuario);
    cy.get("#input_1").type(PLANET_SALUD.passowrd);
    cy.contains("Iniciar sesión").click();
  });

  it("Leer el excel y añadir descripciones", () => {
    cy.leerXls("ps-description.xlsx").then((xls) => {
      cy.xls2Json(xls).then((json) => {
        json.productos.forEach((producto) => {
          cy.visit(PLANET_SALUD.productosPage);
          cy.get("#product-search").clear().type(`${producto.codigo}{enter}`);
          cy.xpath(`//td/a[text()="${producto.codigo}"]`).click();
          cy.get("._md-nav-button").contains("Detalles").click();
          cy.get("[name='descriptionForm'] [id^=taTextElement]")
            .first()
            .click()
            .type(`{selectall}{del}${producto.description}{enter}`); // Primero borra el texto y luego escribe el nuevo
          cy.xpath(
            "//form[@name='descriptionForm']/..//button[@translate='GENERAL.SAVE']"
          )
            .contains("Guardar")
            .click({ force: true });
        });
        cy.visit(PLANET_SALUD.homePage);
      });
    });
  });

  after("Cerrar sesión", () => {
    cy.get(".username").click();
    cy.contains("Cerrar Sesión").click();
  });
}); // Cierre de describe
