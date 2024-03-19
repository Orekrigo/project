import {defineStore} from "pinia";

export const useImgStore = defineStore('img', () => {
    function getImgUrl(file) {
        return new URL(`../assets/img/${file}`, import.meta.url).href;
    }

    return {getImgUrl}
})
