import {BACKEND_URL} from './config.js';

export async function createResult (payload) {
    const newResult = await fetch(`${BACKEND_URL}/results`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then(res => res.json());
    return newResult;
};

export async function getResult () {
    //Don't have to do anything here, since it's unused.
};

export async function updateResult (id, payload) {
    await fetch(`${BACKEND_URL}/results/${id}`,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
};

export async function filterResult (payload) {
    const results = await fetch(`${BACKEND_URL}/results/filter`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then(res => res.json());
    return results;
};

export async function deleteResult (id) {
    await fetch(`${BACKEND_URL}/results/${id}`,{
        method: "DELETE",
    });
};