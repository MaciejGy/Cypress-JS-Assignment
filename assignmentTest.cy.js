function createAnItem(name, category, size, price) {
  // getting the needed DOM elements and performing Cypress commands in order to test a happy path
  category = category.charAt(0).toUpperCase() + category.slice(1); // adding this to allow more flexibility in ways that someone later calls the function
  cy.get('input[placeholder="Item Name"]').type(name);
  cy.get(".rec-slf-listing-attribute-category")
    .select(category)
    .should("have.value", category);
  if (category === "Shoes") {
    cy.get('div[data-category="shoes"]').find("select").select(size);
  } else if (category === "Pants") {
    cy.get('div[data-category="pants"]').find("select").select(size);
  } else {
    cy.get('div[data-category="t-shirts"]').find("select").select(size);
  }

  // entering price and clicking on the 'Confirm' button
  cy.get('input[name="listing_price"]').type(price);
  cy.get("#rec-slf-action-listing-bottom").click();
}

describe("Automated test cases", () => {
  beforeEach("open the form page", () => {
    cy.visit("/");
  });

  it("List a new product with all required data provided", () => {
    createAnItem("Shoes 1", "Shoes", 32, 50);
    // mocking success message
    cy.contains("Item has been successfully listed on the page");
  });

  it("Try to list a new product with a price exceeding the maximum(100)", () => {
    createAnItem("Pants 1", "Pants", 34, 150);
    // mocking error message
    cy.contains(
      "The maximum price has been exceeded, please lower it to continue"
    );
  });

  it("Verify that all size dropdowns are disabled when the corresponding category is not selected", () => {
    // asserting that the default value for the category dropdown is selected
    cy.get(".rec-slf-listing-attribute-category")
      .find("option")
      .first()
      .should("have.attr", "selected");
    // iterating over all select DOM elements, but the first one(category) to check if they have disabled as their attribute
    for (let i = 1; i < 4; i++) {
      cy.get("select").eq(i).should("have.attr", "disabled");
    }
  });
});
