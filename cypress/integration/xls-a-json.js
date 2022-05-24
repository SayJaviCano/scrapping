describe("convert data to Json", () => {
  it("read data from excel", () => {
    cy.leerXls("ps-description.xlsx").then((xls) => {
      cy.xls2Json(xls).then((json) => {
        cy.writeFile("mi-json.json", json);
      });
    });
  });
});
