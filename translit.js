(function () {
    var root = this;
    var translit = function (str, typ) {
        if (str != undefined) {
            var func = (function (typ) {
                function prep(a) {
                    var write = [
                        function (chr, row) {
                            trantab[row] = chr;
                            regarr.push(row);
                        },
                        function (row, chr) {
                            trantab[row] = chr;
                            regarr.push(row);
                        }
                    ][a];
                    return function (col, row) {       // создаем таблицу и RegExp
                        var chr = col[abs] || col[0];   // Символ
                        if (chr) write(chr, row);       // Если символ есть
                    }
                }

                var abs = Math.abs(typ);             // Абсолютное значение транслитерации
                if (typ === abs) {                   // Прямая транслитерация в латиницу
                    str = str.replace(/(i(?=.[^аеиоуъ\s]+))/ig, '$1`'); // "i`" ГОСТ ст. рус. и болг.
                    return [prep(0),                   // Возвращаем массив функций
                        function (str) {                  // str - транслируемая строка.
                            return str.replace(/i``/ig, 'i`').// "i`" в ГОСТ ст. рус. и болг.
                            replace(/((c)z)(?=[ieyj])/ig, '$1'); // "cz" в символ "c"
                        }];
                } else {                             // Обратная транслитерация в кириллицу
                    str = str.replace(/(c)(?=[ieyj])/ig, '$1z'); // Правило сочетания "cz"
                    return [prep(1), function (str) {
                        return str;
                    }];// nop - пустая функция.
                }
            }(typ));
            var iso9 = {                           // Объект описания стандарта
                // Имя - кириллица
                //   0 - общие для всех
                //   1 - диакритика         4 - MK|MKD - Македония
                //   2 - BY|BLR - Беларусь  5 - RU|RUS - Россия
                //   3 - BG|BGR - Болгария  6 - UA|UKR - Украина
                /*-Имя---------0-,-------1-,---2-,---3-,---4-,----5-,---6-*/
                '\u0449': ['', '\u015D', '', 'sth', '', 'shh', 'shh'], // 'щ'
                '\u044F': ['', '\u00E2', 'ya', 'ya', '', 'ya', 'ya'], // 'я'
                '\u0454': ['', '\u00EA', '', '', '', '', 'ye'], // 'є'
                '\u0463': ['', '\u011B', '', 'ye', '', 'ye', ''], //  ять
                '\u0456': ['', '\u00EC', 'i', 'i`', '', 'i`', 'i'], // 'і' йота
                '\u0457': ['', '\u00EF', '', '', '', '', 'yi'], // 'ї'
                '\u0451': ['', '\u00EB', 'yo', '', '', 'yo', ''], // 'ё'
                '\u044E': ['', '\u00FB', 'yu', 'yu', '', 'yu', 'yu'], // 'ю'
                '\u0436': ['zh', '\u017E'],                                 // 'ж'
                '\u0447': ['ch', '\u010D'],                                 // 'ч'
                '\u0448': ['sh', '\u0161', '', '', '', '', ''], // 'ш'
                '\u0473': ['', 'f\u0300', '', 'fh', '', 'fh', ''], //  фита
                '\u045F': ['', 'd\u0302', '', '', 'dh', '', ''], // 'џ'
                '\u0491': ['', 'g\u0300', '', '', '', '', 'g`'], // 'ґ'
                '\u0453': ['', '\u01F5', '', '', 'g`', '', ''], // 'ѓ'
                '\u0455': ['', '\u1E91', '', '', 'z`', '', ''], // 'ѕ'
                '\u045C': ['', '\u1E31', '', '', 'k`', '', ''], // 'ќ'
                '\u0459': ['', 'l\u0302', '', '', 'l`', '', ''], // 'љ'
                '\u045A': ['', 'n\u0302', '', '', 'n`', '', ''], // 'њ'
                '\u044D': ['', '\u00E8', 'e`', '', '', 'e`', ''], // 'э'
                '\u044A': ['', '\u02BA', '', 'a`', '', '``', ''], // 'ъ'
                '\u044B': ['', 'y', 'y`', '', '', 'y`', ''], // 'ы'
                '\u045E': ['', '\u01D4', 'u`', '', '', '', ''], // 'ў'
                '\u046B': ['', '\u01CE', '', 'o`', '', '', ''], //  юс
                '\u0475': ['', '\u1EF3', '', 'yh', '', 'yh', ''], //  ижица
                '\u0446': ['cz', 'c'],                                 // 'ц'
                '\u0430': ['a'],                                           // 'а'
                '\u0431': ['b'],                                           // 'б'
                '\u0432': ['v'],                                           // 'в'
                '\u0433': ['g'],                                           // 'г'
                '\u0434': ['d'],                                           // 'д'
                '\u0435': ['e'],                                           // 'е'
                '\u0437': ['z'],                                           // 'з'
                '\u0438': ['', 'i', '', 'i', 'i', 'i', 'y`'], // 'и'
                '\u0439': ['', 'j', 'j', 'j', '', 'j', 'j'], // 'й'
                '\u043A': ['k'],                                           // 'к'
                '\u043B': ['l'],                                           // 'л'
                '\u043C': ['m'],                                           // 'м'
                '\u043D': ['n'],                                           // 'н'
                '\u043E': ['o'],                                           // 'о'
                '\u043F': ['p'],                                           // 'п'
                '\u0440': ['r'],                                           // 'р'
                '\u0441': ['s'],                                           // 'с'
                '\u0442': ['t'],                                           // 'т'
                '\u0443': ['u'],                                           // 'у'
                '\u0444': ['f'],                                           // 'ф'
                '\u0445': ['x', 'h'],                                 // 'х'
                '\u044C': ['', '\u02B9', '`', '`', '', '`', '`'], // 'ь'
                '\u0458': ['', 'j\u030C', '', '', 'j', '', ''], // 'ј'
                '\u2019': ['\'', '\u02BC'],                                 // '’'
                '\u2116': ['#']                                           // '№'
                /*-Имя---------0-,-------1-,---2-,---3-,---4-,----5-,---6-*/
            }, regarr = [], trantab = {};
            /* jshint -W030 */                     // Создание таблицы и массива RegExp
            for (var row in iso9) {
                if (Object.hasOwnProperty.call(iso9, row)) {
                    func[0](iso9[row], row);
                }
            }
            /* jshint +W030 */
            return func[1](                        // функция пост-обработки строки (правила и т.д.)
                str.replace(                       // Транслитерация
                    new RegExp(regarr.join('|'), 'gi'),// Создаем RegExp из массива
                    function (R) {                      // CallBack Функция RegExp
                        if (R.toLowerCase() === R) {     // Обработка строки с учетом регистра
                            return trantab[R];
                        } else {
                            return trantab[R.toLowerCase()].toUpperCase();
                        }
                    }));
        }
        return false;
    };
    if (typeof exports !== 'undefined') {
        //supports node
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = translit;
        }
        exports.translit = translit;
    } else {
        //supports globals
        root.translit = translit;
    }

    return translit;
})().call(this);

