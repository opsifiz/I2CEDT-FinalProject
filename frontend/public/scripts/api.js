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
    
};

export async function updateResult () {
    
};

export async function filterResult () {
    
};

export async function deleteResult () {
    
};