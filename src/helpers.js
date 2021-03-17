       
    //turns flattened record.params requests back into array of objects

    export const createObjectsFromParams = (params, keyParam) => {

        const requestKeys = Object.keys(params).filter(key => { return key.includes(keyParam)});

        return requestKeys.reduce( (accumulator, key) => {

            let splitArray = key.split('.');
    
            if (!accumulator[splitArray[1]]){
                accumulator[splitArray[1]] = {};
            }
    
            accumulator[splitArray[1]][splitArray[2]] = params[key];
    
            return accumulator
        }, [] )

    }

    
    export const priceFormat = price => {
    
        if (price) {
            return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        }else {
            return '$0.00'
        }  
    
    };





    

