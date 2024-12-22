describe("List", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/list");
  });

  it("should load more data when scrolling to bottom", () => {
    cy.get("li").should("have.length.at.least", 1);
    cy.wait(3000);
    cy.get("li")
      .its("length")
      .then((initialCount) => {
        cy.get("div.overflow-auto.scrollable").scrollTo("bottom");
        cy.wait(3000);
        cy.get("li").its("length").should("be.gt", initialCount);
      });
  });

  it("message of loading more elements appears and disappears", () => {
    cy.get("li").should("have.length.at.least", 1);
    cy.wait(3000);
    cy.get("div.overflow-auto.scrollable").scrollTo("bottom");
    cy.contains("Loading more elements...").should("be.visible");
    cy.wait(3000);
    cy.contains("Loading more elements...").should("not.exist");
  });
});

describe("Signin page", () => {
  it("should handle sign in process correctly", () => {
    cy.visit("/signin");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("form").submit();
    cy.url().should("eq", "http://localhost:3000/");
    cy.contains("Welcome, John Doe!").should("be.visible");
  });
});

describe("When not authenticated", () => {
  it("should show sign in button when not authenticated on home", () => {
    cy.visit("/");
    cy.contains("Sign in").should("be.visible");
  });

  it("should redirect to '/' when trying to access dashboard", () => {
    cy.visit("/dashboard");
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("should redirect to '/' when trying to access list", () => {
    cy.visit("/list");
    cy.url().should("eq", "http://localhost:3000/");
  });
});

describe("Home", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });

  it("should show greeting message on home", () => {
    cy.contains("John Doe").should("exist");
  });
});

describe("Dashboard", () => {
  beforeEach(() => {
    cy.login();
  });

  it("shows dashboard elements correctly", () => {
    cy.visit("/dashboard");
    cy.contains("Price of Bitcoin").should("exist");
    cy.get('button[role="combobox"]').should("exist");
    cy.get(".recharts-line").should("exist");
  });

  it("changes crypto correctly", () => {
    cy.visit("/dashboard");
    cy.get('button[role="combobox"]').click();
    cy.contains(".cursor-pointer", "Ethereum").click();
    cy.get('button[role="combobox"]').should("contain.text", "Ethereum");
    cy.contains("Price of Ethereum").should("exist");
  });

  it("searches crypto and updates the selection", () => {
    cy.visit("/dashboard");
    cy.get('button[role="combobox"]').click();
    cy.get('input[placeholder="Search cryptocurrency..."]').type("dogecoin");
    cy.contains(".cursor-pointer", "Dogecoin").should("exist");
  });

  it("shows error message when error in fetching data", () => {
    cy.intercept("GET", /\/api\/fetchCrypto.*/, {
      statusCode: 500,
      body: {},
    });
    cy.visit("/dashboard");
    cy.contains("Failed to load initial data. Please try again later.").should(
      "exist"
    );
  });
});
