const fetch = require('node-fetch');

// all functions, that work on finAPI are here

// get an accessToken, gets only called
// by getClientAccessToken or
// by getUserAccessToken
const getAccessToken = async(body) =>  {
    let api_url = 'https://sandbox.finapi.io/oauth/token';

    // login as client, get access token
    let api_response = await fetch(api_url, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // extract access_token
    let json_response = await api_response.json();
    return 'Bearer ' + json_response['access_token']
}

const getClientAccessToken = async () => {
    const body = new URLSearchParams({
        'grant_type': "client_credentials",
        'client_id': process.env.finAPI_client_id,
        'client_secret': process.env.finAPI_client_secret,
    });
    return await getAccessToken(body);
}

const getUserAccessToken = async (user) => {
    const body = new URLSearchParams({
        'grant_type': "client_credentials",
        'client_id': process.env.finAPI_client_id,
        'client_secret': process.env.finAPI_client_secret,
    });

    body.append("username", user.finUserId);
    body.append("password", user.finUserPassword);

    return await getAccessToken(body);
}

// create a user in finAPI and return credentials
const createFinAPIUser = async () => {
    const access_token = await getClientAccessToken();

    // prepare body for user-creation
    const body = {
        id: undefined,
        password: undefined,
        email: undefined,
        phone: undefined,
        isAutoUpdateEnabled: true
    };

    // adjust url for user-creation
    const api_url = `https://sandbox.finapi.io/api/v1/users`;
    const api_response = await fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': access_token
        }
    });

    const json_response = await api_response.json();

    return {
        finUserId : json_response.id,
        finUserPassword : json_response.password
    };
}

const deleteFinAPIUser = async (user) => {
    const access_token = await getUserAccessToken(user);
    const api_url = `https://sandbox.finapi.io/api/v1/users`;

    await fetch(api_url, {
        method: 'DELETE',
        headers: {
            'Authorization': access_token
        }
    });

}



const searchBanks = async (searchString) => {
    const access_token = await getClientAccessToken();

    // todo filter, so that only 'isValid = true' banks are shown
    // todo filter, so that only 'isValid = true' banks are shown
    // todo filter, so that only 'isValid = true' banks are shown

    const params = new URLSearchParams({
        'search': searchString, // main field, others if needed
    });

    const api_url = `https://sandbox.finapi.io/api/v1/banks?${params}`;
    const api_response = await fetch(api_url, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': access_token
        }
    });

    const banks = await api_response.json();
    console.log(banks);

    return banks;

}

const importBankConnection = async (user,bankId) => {
    const access_token = await getUserAccessToken(user);

    let body = { //e.g. 26628 - stadtsparkasse
        bankId: bankId
    };

    const api_response = await fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': access_token
        }
    });

    const json_response = await api_response.json();
    return {
        "link": json_response.headers.get('Location')
    }
}

const getAllBankConnections = async (user) => {
    const access_token = await getUserAccessToken(user);
    var ids = new URLSearchParams({});

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections?${ids}`;
    const api_response = await fetch(api_url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': access_token
        }
    });

    return await api_response.json();
}

const deleteOneBankConnection = async (user,id) => {
    const access_token = await getUserAccessToken(user);

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/${id}`;
    await fetch(api_url, {
        method: 'DELETE',
        headers: {
            'Authorization': access_token
        }
    });
}

const deleteAllBankConnections = async (user) => {
    const access_token = await getUserAccessToken(user);

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections`;
    await fetch(api_url, {
        method: 'DELETE',
        headers: {
            'Authorization': access_token
        }
    });
}

module.exports = {
    createFinAPIUser,
    deleteFinAPIUser,
    searchBanks,
    importBankConnection,
    getAllBankConnections,
    deleteOneBankConnection,
    deleteAllBankConnections
}