export default class Environment {
    /**
     * Get the Env value (String), the default value or undefined
     * @param {String} value
     * @param {*} defaultValue
     */
    static get(value, defaultValue) {
        if (value && process.env[value]) {
            return process.env[value];
        } else {
            return defaultValue;
        }
    };

    /**
     * Get the Env value (boolean), the default value or undefined
     * @param {} value
     * @param {*} defaultValue
     */
    static getBool(value, defaultValue) {
        return Environment.get(value, defaultValue) == 'true';
    };

    /**
     * Get the Env value (Number), the default value or undefined
     * @param {*} value
     * @param {*} defaultValue
     */
    static getNumber(value, defaultValue) {
        return Number(Environment.get(value, defaultValue));
    };
}