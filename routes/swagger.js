/**
 * @swagger
 * definitions:
 *  positionQty:
 *    type: object
 *    properties: 
 *      isin:
 *        type: string
 *      qty: 
 *        type: number
 *  error:
 *    type: object
 *    properties:
 *      error:
 *        type: string
 *        enum:
 *        - AUTH_TOKEN_INVALID
 *        - AUTH_TOKEN_EXPIRED
 *        - PORTFOLIO_ID_INVALID
 *        - PORTFOLIO_NAME_INVALID
 *        - PORTFOLIO_NAME_DUPLICATE
 *        - TIMESTAMP_INVALID
 *        - ISIN_INVALID  
 *        - QTY_INVALID
 *        - RANGE_INVALID
 *        - REAL_PORTFOLIO_MODIFICATION
 *  range: 
 *    type: string
 *    enum:
 *      - "7D"
 *      - "1M"
 *      - "6M"
 *      - "YTD"
 *      - "1J"
 *      - "5J"
 *      - "MAX"
 *  stock: 
 *    type: object
 *    properties: 
 *      isin:
 *        type: string
 *      symbol:
 *        type: string
 *      name:
 *        type: string
 *      price:
 *        type: number
 *      perf7d:
 *        type: number
 *      perf1y: 
 *        type: number
 *      country:
 *        type: string
 *      industry:
 *        type: string
 *      score: 
 *        type: number
 *  portfolioOverview:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *      name:
 *        type: string
 *      virtual:
 *        type: boolean
 *      positionCount:
 *        type: integer
 *      value: 
 *        type: number
 *      score:
 *        type: number
 *      perf7d:
 *        type: number
 *      perf1y:
 *        type: number
 *      modified: 
 *        type: number
 *        format: UNIX timestamp
 *  position:
 *    type: object
 *    properties:
 *      stock:
 *        $ref: '#/definitions/stock'
 *      qty:
 *        type: number
 *  risk:
 *    type: object
 *    properties:
 *      count:
 *        type: integer
 *      score:
 *        type: number
 *      warnings:
 *        type: array
 *        items:
 *          type: string
 *  riskAnalysis:
 *    type: object
 *    properties:
 *      countries:
 *        $ref: '#/definitions/risk'
 *      segments:
 *        $ref: '#/definitions/risk'
 *      currency: 
 *        $ref: '#/definitions/risk'
 *  keyFigures:
 *    type: object
 *    properties:
 *      year:
 *        type: integer
 *      pte: 
 *        type: number
 *      ptb:
 *        type: number
 *      ptg:
 *        type: number
 *      eps: 
 *        type: number
 *      div:
 *        type: number
 *  portfolioDetails:
 *    type: object
 *    properties:
 *      overview:
 *        $ref: '#/definitions/portfolioOverview'
 *      positions: 
 *        type: array
 *        items: 
 *          $ref: '#/definitions/position'
 *      risk:
 *        $ref: '#/definitions/riskAnalysis'
 *      keyFigures:
 *        type: array
 *        items:
 *          $ref: '#/definitions/keyFigures'
 *      nextDividend:
 *        type: number
 *        format: UNIX timestamp
 *      dividendPayoutRatio:
 *        type: number
 *
 * /portfolio/list:
 * get:
 *  tags:
 *  - portfolio
 *  summary: Get all portfolios of the current user
 *  description: Gets all portfolios of the current user with basic information to display in the portfolio dashboard.
 *  operationId: getPortfolios
 *  produces:
 *  - application/json
 *  parameters: []
 *  responses:
 *    200:
 *      description: successful operation
 *      schema:
 *        type: array
 *        items:
 *          $ref: '#/definitions/portfolioOverview'
 *  security:
 *  - api_key: [] 
 *
 * /portfolio/details/{portfolioId}:
 *   get:
 *     tags:
 *     - portfolio
 *     summary: Get details of portfolio
 *     description: Gets portfolio details including key figures, scores and positions.
 *     operationId: getPortfolio
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio that needs to be fetched
 *       required: true
 *       type: integer
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/portfolioDetails'
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *
 * /portfolio/performance/{portfolioId}:
 *   get:
 *     tags:
 *     - portfolio
 *     summary: Get data for portfolio chart
 *     description: Gets the data points to display a performance chart.
 *     operationId: portfolioPerformance
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *       - in: body
 *         name: range
 *         description: The range
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             range:
 *               $ref: '#/definitions/range'
 *       - name: portfolioId
 *         in: path
 *         description: ID of the portfolio to get its data points
 *         required: true
 *         type: integer
 *     responses:
 *       200: 
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             chart:
 *               type: array
 *               items:
 *                 type: number
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: RANGE_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *
 * /portfolio/create:
 *   post: 
 *     tags:
 *     - portfolio
 *     summary: Create new portfolio
 *     description: Creates a new, empty, virtual portfolio and saves the timestamp of the portfolio creation in the portfolio's history.
 *     operationId: createPortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *       - in: body
 *         name: name
 *         description: The name of the new portfolio
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       200: 
 *         description: successful operation
 *         schema: 
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *       400:
 *         description: PORTFOLIO_NAME_DUPLICATE/PORTFOLIO_NAME_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *
 * /portfolio/{portfolioId}:
 *   delete:
 *     tags:
 *     - portfolio
 *     summary: Delete portfolio by ID
 *     description: For valid response try integer IDs with positive integer value.\
 *       \ Negative or non-integer values will generate API errors
 *     operationId: deletePortfolio
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be deleted
 *       required: true
 *       type: integer
 *     responses:
 *       200: 
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_NOT_EXISTS
 *         schema:
 *           $ref: '#/definitions/error'
 *
 *   /portfolio/rename/{portfolioId}:
 *   put:
 *     tags:
 *     - portfolio
 *     summary: Rename a portfolio
 *     description: Renames a portfolio.
 *     operationId: renamePortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: name
 *       description: The new name of the portfolio
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be renamed
 *       required: true
 *       type: integer
 *     responses:
 *       200: 
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: PORTFOLIO_NAME_DUPLICATE/PORTFOLIO_NAME_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *
 * /portfolio/modify/{portfolioId}:
 *   put:
 *     tags:
 *     - portfolio
 *     summary: Modify positions of a portfolio
 *     description: Modifies the positions of a portfolio and saves the timestamp of the modification in the portfolio's history.
 *     
 *       If the specified quantity of a position is 0, the position of the specified stock is deleted if it exists.
 *       If there is no position of the specified stock, a new position with the specified quantity is created.
 *       Otherwise, the position of the specified stock is updated to match the specified quantity.
 *       
 *       Positions not included in the request remain unchanged.
 *     operationId: modifyPortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: modifications
 *       description: Which positions need to be changed
 *       schema:
 *         type: object
 *         properties:
 *           modifications:
 *             type: array
 *             items:
 *               $ref: '#/definitions/positionQty'
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be modified
 *       required: true
 *       type: integer
 *     responses:
 *       200: 
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: QTY_INVALID/ISIN_INVALID/REAL_PORTFOLIO_MODIFICATION
 *         schema:
 *           $ref: '#/definitions/error'
 *
 * /portfolio/duplicate/{portfolioId}:
 *   post:
 *     tags:
 *     - portfolio
 *     summary: Duplicate a portfolio
 *     description: Creates a new virtual portfolio as a duplicate of a real or virtual portfolio. Changes to a real portfolio will not be tracked in the duplicated version.
 *     operationId: duplicatePortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: name
 *       description: The name of the new portfolio
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be duplicated
 *       required: true
 *       type: integer
 *     responses:
 *       200: 
 *         description: successful operation
 *         schema: 
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: PORTFOLIO_NAME_DUPLICATE/PORTFOLIO_NAME_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 */