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
 *  stockk:
 *    type: object
 *    properties: 
 *      symbol:
 *        type: string
 *      isin:
 *        type: string
 *      wkn:
 *        type: string
 *      name:
 *        type: string
 *      price:
 *        type: string
 *      per1d:
 *        type: string
 *      per7d:
 *        type: string
 *      per30d:
 *        type: string
 *      per365d:
 *        type: string
 *      marketCapitalization: 
 *        type: string
 *      analystTargetPrice: 
 *        type: string
 *      valuation: 
 *        type: string
 *      growth: 
 *        type: string
 *      div: 
 *        type: string
 *      currency: 
 *        type: string
 *      country: 
 *        type: string
 *      industry: 
 *        type: string
 *      picture: 
 *        type: string
 *      date: 
 *        type: string
 *  stockks: 
 *        type: array
 *        items: 
 *          $ref: '#/definitions/stockk'
 *  stockDetails:
 *      type: object
 *      properties:
 *          symbol:
 *              type: string
 *          intro:
 *              type: string
 *          founded:
 *              type: string
 *          website:
 *              type: string
 *          fullTimeEmployees:
 *              type: string
 *          address:
 *              type: string
 *          assembly:
 *              type: string
 *  dataPoint:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *      close:
 *        type: string
 *  dataPoints:
 *        type: array
 *        items:
 *          $ref: '#/definitions/dataPoint'
 *  keyFigureee:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *      pte:
 *        type: string
 *      ptb:
 *        type: string
 *      ptg:
 *        type: string
 *      eps:
 *        type: string
 *  keyFigureees:
 *        type: array
 *        items:
 *          $ref: '#/definitions/keyFigureee'
 *
 *  dataPointtt:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *      div:
 *        type: string
 *  dataPointtts:
 *        type: array
 *        items:
 *          $ref: '#/definitions/dataPointtt'
 *
 *  rating:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *      goal:
 *        type: string
 *      strategy:
 *        type: string
 *      source:
 *        type: string
 *
 *  ratings:
 *        type: array
 *        items:
 *          $ref: '#/definitions/rating'
 *
 *  portfolioOverview:
 *    type: object
 *    properties:
 *      id:
 *        type: string
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
 *      totalReturn:
 *        type: number
 *      totalReturnPercent:
 *          type: number
 *  portfolioQty:
 *      type: object
 *      properties:
 *          id:
 *              type: string
 *          qty:
 *              type: number
 *  portfolioStock:
 *      type: object
 *      properties:
 *          id:
 *              type: string
 *          name:
 *              type: string
 *          qty:
 *              type: number
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
 *      dividendPayoutRatio:
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
 *      totalReturn:
 *          type: number
 *      totalReturnPercent:
 *          type: number
 *
 *  bestYear:
 *      properties:
 *          changeBest:
 *              type: number
 *          yearBest:
 *              type: string
 *          growthRateBest:
 *              type: number
 *
 *  worstYear:
 *      properties:
 *          changeWorst:
 *              type: number
 *          yearBest:
 *              type: string
 *          growthRateWorst:
 *              type: number
 *
 *  backtestResult:
 *      type: object
 *      properties:
 *           MDDMaxToMin:
 *              type: number
 *           MDDInitialToMin":
 *              type: number
 *           dateMax:
 *              type: string
 *           dateMin:
 *              type: string
 *           maxValue:
 *              type: number
 *           minValue:
 *              type: number
 *           initialValue:
 *              type: number
 *           bestYear:
 *               $ref: '#/definitions/bestYear'
 *           worstYear:
 *               $ref: '#/definitions/worstYear'
 *           finalPortfolioBalance:
 *              type: number
 *           CAGR:
 *              type: number
 *           standardDeviation:
 *              type: number
 *           sharpeRatio:
 *              type: number
 *
 * /portfolio/list:
 *  get:
 *    tags:
 *    - portfolio
 *    summary: Get all portfolios of the current user
 *    description: Gets all portfolios of the current user with basic information to display in the portfolio dashboard.
 *    operationId: getPortfolios
 *    produces:
 *    - application/json
 *    parameters: []
 *    responses:
 *      200:
 *        description: successful operation
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/portfolioOverview'
 *    security:
 *    - api_key: [] 
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
 *       type: string
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
 *         type: string
 *     responses:
 *       200: 
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             chart:
 *               type: array
 *               items:
 *                  type: array
 *                  items:
 *                      type: number
 *                  minItems: 2
 *                  maxItems: 2
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: RANGE_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *
 * /portfolio/stock:
 *   get:
 *     tags:
 *     - portfolio
 *     summary: Gets the portfolio name and quantity of a specified stock for all portfolios of the current user.
 *     description: This information is displayed to the user when adding a stock to his portfolios.
 *     operationId: portfolioStock
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *       - in: body
 *         name: isin
 *         description: ISIN of the specified stock
 *         required: true
 *         schema:
 *            type: object
 *            properties:
 *              isin:
 *                type: string
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/portfolioStock'
 *       400:
 *         description: ISIN_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *   put:
 *     tags:
 *     - portfolio
 *     summary: Modify stock quantity
 *     description: Modifies a stock's quantity within multiple portfolios simultaneously.
 *
 *      If the specified quantity for a portfolio is 0, the position in the specified portfolio is deleted if it exists.
 *      If there is no position in the specified portfolio, a new position with the specified quantity is created.
 *      Otherwise, the position in the specified portfolio is updated to match the specified quantity.
 *
 *      Positions not included in the request remain unchanged.
 *     operationId: modifyStocks
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: isin and modifications
 *       description: ISIN of the specified stock
 *       schema:
 *         type: object
 *         properties:
 *           isin:
 *             type: string
 *           modifications:
 *             type: array
 *             items:
 *               $ref: '#/definitions/portfolioQty'
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
 *       type: string
 *     responses:
 *       200: 
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_NOT_EXISTS
 *         schema:
 *           $ref: '#/definitions/error'
 *
 * /portfolio/rename/{portfolioId}:
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
 *       type: string
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
 *       If the specified quantity for a portfolio is 0, the position in the specified portfolio is deleted if it exists.
 *       If there is no position in the specified portfolio, a new position with the specified quantity is created.
 *       Otherwise, the position in the specified portfolio is updated to match the specified quantity.
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
 *       type: string
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
 *       type: string
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
 *
 * /stocks/list?{country}&{currency}&{industry}&{mc}:
 *  get:
 *   summary: Returns a stock list according to filter.
 *   description: Returns a stock list according to filter.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: country
 *       in: path
 *       description: country of stock
 *       required: false
 *       type: string
 *     - name: currency
 *       in: path
 *       description: currency of stock
 *       required: false
 *       type: string
 *     - name: industry
 *       in: path
 *       description: industry of stock
 *       required: false
 *       type: string
 *     - name: mc
 *       in: path
 *       description: market capitalization of stock
 *       required: false
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        stocks:
 *         $ref: '#/definitions/stockks'
 *    '400':
 *      description: Invalid
 *
 * /stocks/search?{id}:
 *  get:
 *   summary: Returns a stock with given id.
 *   description: Returns a stock with given id.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: can be name, isin, wkn, symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        stocks:
 *         $ref: '#/definitions/stockks'
 *    '400':
 *      description: Invalid
 *
 * /stocks/details/search?{id}:
 *  get:
 *   summary: Returns details of a stock with given id.
 *   description: Returns details of a stock with given id.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *          $ref: '#/definitions/stockDetails'
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/historic/search?{id}&{max}:
 *  get:
 *   summary: Get the performance of the stock from beginning or last 5 years.
 *   description: Get the performance of the stock from beginning or last 5 years.
 *   produces:
 *    - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *     - name: max
 *       in: path
 *       description: all data points if true, else only last 5 years
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        dataPoints:
 *         $ref: '#/definitions/dataPoints'
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/key_figures/search?{id}&{max}:
 *  get:
 *   summary: Get the key figures of the stock from beginning or last 5 years.
 *   description: Get the key figures of the stock from beginning or last 5 years.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *     - name: max
 *       in: path
 *       description: all data points if true, else only last 5 years
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        keyFigures:
 *         $ref: '#/definitions/keyFigureees'
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/dividend/search?{id}&{max}:
 *  get:
 *   summary: Get the key figures of the stock from beginning or last 5 years.
 *   description: Get the key figures of the stock from beginning or last 5 years.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *     - name: max
 *       in: path
 *       description: all data points if true, else only last 5 years
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        dataPoints:
 *         $ref: '#/definitions/dataPointtts'
 *        date:
 *         type : string
 *        quota:
 *         type : string
 *    '400':
 *      description: Invalid
 *
 * stocks/charts/analysts/search?{id}:
 *  get:
 *   summary: Get the analysts recommendation.
 *   description: Get the analysts recommendation.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *          type: object
 *          properties:
 *              ratings:
 *                  $ref: '#/definitions/ratings'
 *              averageGoal:
 *                  type: string
 *    '400':
 *      description: Invalid
 *
 *
 * /user/register:
 *  post:
 *   description: Confirms, that the token is correct, which has been sent to users email address.
 *   summary: Confirmation of token.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Token was accepted. Users account is now registered.
 *    '404':
 *      description: Token was not accepted.
 *
 * /user/login:
 *  post:
 *   description: Checks if email and password are correct. sends back a token that needs to be passed in the header of each user-relevant request.
 *   summary: Confirming email and password.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Password accepted.
 *    '401':
 *      description: Password is not correct or email is not registered.
 *
 * /user/profile:
 *  get:
 *   description: Sends back account information about user profile.
 *   summary: Sends account information.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted.
 *    '401':
 *      description: Unauthorized. Token not valid.
 *
 * /user/forgot:
 *  post:
 *   description: If user has forgotten password, a token will be sent to email, that has to be confirmed.
 *   summary: Requesting token when password was forgotten.
 *   tags:
 *    - user
 *   responses:
 *    '202':
 *      description: Email exists, token will be sent.
 *    '401':
 *      description: Not foundMail was not found.
 *
 * /user/reset/confirm:
 *  post:
 *   description: Confirms token that was sent to user-email, when a user has forgotten the password to his account.
 *   summary: Confirming forgotten password token.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Token was correct, password can now be reset.
 *    '404':
 *      description: Not found. Token was not found.
 *
 * /user/edit:
 *  put:
 *   description: Edit user account information.
 *   summary: Edit user account information.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Token was correct, user-account will be edited as specified.
 *    '404':
 *      description: Not found, Token was not found.
 *
 * /user/delete:
 *  delete:
 *   description: Delete user-account.
 *   summary: Delete user-account.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, user-account will be deleted.
 *    '404':
 *      description: Not found, Token was not found.
 *
 * /user/bank:
 *  get:
 *   description: Sends back banks, that fit the passed String.
 *   summary: Sends back banks, that fit the passed String.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted.
 *  post:
 *   description: adds a bank-connection.
 *   summary: Adding a bank-connection.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, bank-connection added.
 *    '404':
 *      description: Rejected, Token was not found.
 *  delete:
 *   description: bank-connection with id will be deleted.
 *   summary: Deleting  bank-connection.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, bank-connection deleted.
 *
 * /analytics/backtest/{portfolioId}?{fromDate}&{toDate}:
 *  get:
 *   description: Backtests a real or a virtual portfolio for a given period of time
 *   summary: Backtests a real or a virtual portfolio for a given period of time
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be backtested
 *       required: true
 *       type: string
 *     - name: fromDate
 *       in: path
 *       description: Beginning date for the backtest
 *       required: true
 *       type: string
 *     - name: toDate
 *       in: path
 *       description: Ending date for the backtest
 *       required: true
 *       type: string
 *   requestbody:
 *        portfolioId: The id of the Portfolio
 *        startDate: The start date for the backtest
 *        endDate: The end date for the backtest
 *   responses:
 *      '200':
 *          description: Success.
 *          schema:
 *              $ref: '#/definitions/backtestResult'
 * /analytics/diversification/{portfolioId}:
 *  get:
 *   description: Calculates the weighted distribution of stocks in a portfolio among different criterion
 *   summary: Calculates the weighted distribution of stocks in a portfolio among different criterion
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 * /analytics/dividends/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average dividend and also returns the dividends per stock
 *   summary: Calculates the weighted average dividend and also returns the dividends per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 * /analytics/peratios/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average of PERatio of a portfolio and returns also the PERatios per stock
 *   summary: Calculates the weighted average of PERatio of a portfolio and returns also the PERatios per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 * /analytics/gainLoss/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average of Gain or Loss of a portfolio and returns also the gain or loss per stock
 *   summary: Calculates the weighted average of Gain or Loss of a portfolio and returns also the gain or loss per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 * /analytics/volatilityCorrelation/{portfolioId}:
 *  get:
 *   description: Calculates the volatility and correlation of stocks within a portfolio
 *   summary: Calculates the volatility and correlation of stocks within a portfolio
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
* /analytics/sharpeRatio/{portfolioId}:
 *  get:
 *   description: Calculates the sharpe ratio of stocks within a portfolio
 *   summary: Calculates the sharpe ratio of stocks within a portfolio
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 * /analytics/debtEquity/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average of debt/equity of a portfolio and returns also the debt/equity per stock
 *   summary: Calculates the weighted average of debt/equity of a portfolio and returns also the debt/equity per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
*/