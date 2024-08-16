describe('Тест конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', '/api/orders', {
      fixture: 'order.json'
    }).as('getOrders');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getUser');
    cy.wait('@getIngredients');
  });
  it('Список ингредиентов доступен для выбора', () => {
    cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"]').should('have.length.at.least', 1);
    cy.get('[data-ingredient="sauce"]').should('have.length.at.least', 1);
  });

  describe('Проверка работы модальных окон', () => {
    describe('Проверка открытия модальных окон', () => {
      it('Открытие модального окна ингредиента', () => {
        cy.get('#modals').children().should('have.length', 0);
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.get('#modals').children().should('have.length', 2);
      });
    });

    describe('Проверка закрытия модальных окон', () => {
      it('Закрытие по клику на крестик', () => {
        cy.get('#modals').children().should('have.length', 0);
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.get('#modals button:first-of-type').click();
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие по клику на оверлей', () => {
        cy.get('#modals').children().should('have.length', 0);
        cy.get('[data-ingredient="bun"]:first-of-type').click();
        cy.get('#modals>div:nth-of-type(2)').click({ force: true });
        cy.get('#modals').children().should('have.length', 0);
      });
    });
  });

  describe('Проверка добавления ингридиента в BurgerConstructor', () => {
    it('Проверка добавления булки', () => {
      cy.get('[data-cy = burger-constructor]').should('exist');
      cy.get('[data-cy = burger-constructor]').should(
        'not.contain',
        'Краторная булка N-200i (верх)'
      );

      cy.get('[data-cy = burger-constructor]').should(
        'not.contain',
        'Краторная булка N-200i (низ)'
      );
      cy.contains('Добавить').should('exist').click();

      cy.get('[data-cy = bun-top]').should('exist');
      cy.get('[data-cy = bun-bottom]').should('exist');
      cy.get('[data-cy = bun-top]').contains('Краторная булка N-200i (верх)');
      cy.get('[data-cy = bun-bottom]').contains('Краторная булка N-200i (низ)');
      cy.get('[data-cy = burger-constructor]').should(
        'not.contain',
        'Биокотлета из марсианской Магнолии'
      );
      cy.get('[data-cy = burger-constructor]').should(
        'not.contain',
        'Филе Люминесцентного тетраодонтимформа'
      );
      cy.get('[data-cy = burger-constructor]').should(
        'not.contain',
        'Соус Spicy-X'
      );
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();
      cy.contains('Соус Spicy-X')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();
      cy.get('[data-cy = burger-constructor]').within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
        cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
        cy.contains('Соус Spicy-X').should('exist');
      });
    });
    describe('Процесс оформления заказа', () => {
      it('Процедура оформления заказа после авторизации', () => {
        cy.setCookie('accessToken', 'ACCESS_TOKEN');
        cy.setCookie('refreshToken', 'REFRESH_TOKEN');
        cy.wait('@getUser');
        cy.wait('@getIngredients');
        cy.get('[data-cy = order-button]').should('exist');
        cy.get('[data-ingredient="bun"]:first-of-type button').click();
        cy.get('[data-ingredient="main"]:first-of-type button').click();
        cy.get('[data-cy = order-button]').click();
        cy.get('[data-cy = modal]').should('be.visible');
        cy.contains('[data-cy = modal]', '48808').should('exist');
        cy.get('[data-cy = modalclose]').click();
        cy.get('[data-cy = modal]').should('not.exist');
        cy.get('[data-cy = burger-constructor]').within(() => {
          cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
          cy.contains('Филе Люминесцентного тетраодонтимформа').should(
            'not.exist'
          );
          cy.contains('Соус Spicy-X').should('not.exist');
        });
      });
      afterEach(() => {
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
      });
    });
  });
});
