/**
 * LocalizationJS v0.1
 *
 * Biblioteca JavaScript simples para localização
 *
 * Copyright (C) 2014 Erlimar Silva Campos (erlimar@gmail.com)
 *
 * License: MIT
 */

(function Library(global, undefined){
    "use strict";

    var originalLanguage_ = null,
        currentLanguage_ = null,
        languages_ = [],
        dictionary_ = {},
        dictionaries_ = [];

    // Identificando o idioma atual do navegador, se disponível
    if(originalLanguage_ === null && navigator && navigator.language)
        originalLanguage_ = navigator.language.toLowerCase();
    
    if(originalLanguage_ === null && navigator && navigator.browserLanguage)
        originalLanguage_ = navigator.browserLanguage.toLowerCase();

    currentLanguage_ = originalLanguage_;

    /**
     * @private
     *
     * localization#updateEnvironment
     *
     * Atualiza as variáveis internas. Utilizado pelas funções que alteram o
     * contexto da localização.
     */
    function updateEnvironment(){
        dictionary_ = {};

        if(currentLanguage_ === null)
            return;

        var index_ = languages_.indexOf(currentLanguage_);

        if(0 > index_)
            return;

        dictionary_ = dictionaries_[index_];
    };

    /**
     * @public
     *
     * localization.lang
     *
     * Atribui e/ou retorna a linguagem configurada atualmente
     */
    function lang(){
        if(arguments.length === 1 && typeof arguments[0] === typeof '') {
            var lang_ = arguments[0].toLowerCase().trim();
            if(lang_ != '')
                currentLanguage_ = lang_;
        }

        // Restaurando o idioma original
        if(arguments.length === 1 && arguments[0] === null)
            currentLanguage_ = originalLanguage_;

        updateEnvironment();

        return currentLanguage_;
    };

    /**
     * @public
     *
     * localization.translate
     *
     * Faz a tradução de uma string para a localização atual. Caso a mesma
     * não esteja disponível, a própria mensagem é retornada.
     */
    function translate(msg) {
        if(typeof msg !== typeof '')
            throw new Error('localization.translate require a @string!');

        return msg in dictionary_ 
            ? dictionary_[msg] 
            : msg;
    };

    /**
     * @public
     *
     * localization.dictionary
     *
     * Atribui um dicionário de traduções para uma linguagem específica
     */
    function dictionary(lang, dictionary){
        if(typeof lang !== typeof '')
            throw new Error('localization.dictionary param @lang is invalid');

        if(typeof dictionary !== typeof {})
            throw new Error('localization.dictionary param @dictionary is invalid');

        lang = lang.toLowerCase().trim();

        var index_ = languages_.indexOf(lang);

        if(0 > index_){
            var addLangIndex_ = languages_.push(lang) - 1;
            var addLangDict_ = dictionaries_.push(dictionary) - 1;

            if(addLangIndex_ != addLangDict_)
                throw new Error('localization.dictionary internal error(#1)!');
        }else{
            if(index_ >= dictionaries_.length)
                throw new Error('localization.dictionary internal error(#2)!');

            dictionaries_[index_] = dictionary;
        }

        updateEnvironment();
    };

    // Publicando objeto global que disponibiliza a API
    global.localization = {
        lang: lang,
        translate: translate,
        dictionary: dictionary
    };

})(this);
