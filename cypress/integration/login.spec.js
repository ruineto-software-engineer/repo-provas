/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe("Login", () => {
	it("should login successfully", () => {
		const user = {
			email: faker.internet.email(),
			password: faker.internet.password()
		}

		cy.visit("http://localhost:3000/register");

		cy.get("#outlined-basic").type(user.email);
		cy.get("#outlined-adornment-password").type(user.password);
		cy.get("#outlined-adornment-confirm-password").type(user.password);

		cy.intercept("POST", "http://localhost:5000/register").as("register");
		cy.contains("CADASTRAR").click();
		cy.wait("@register");

		cy.contains("Cadastro realizado com sucesso!");

    cy.url().should("equal", "http://localhost:3000/");

    cy.get("#outlined-basic").type(user.email);
		cy.get("#outlined-adornment-password").type(user.password);

    cy.intercept("POST", "http://localhost:5000/login").as("login");
		cy.get("#submit").click();
		cy.wait("@login");

    cy.url().should("equal", "http://localhost:3000/courses");
	});
});