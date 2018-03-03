//dzo.categorymap.js
(function(dzo) {

    var catMap = {

        1: {},
        5: {},
        60: {}, //biz
        91: {}  //premium      
    },

    //set category function
    setCategory = function(siteId, catId) {

        var catmap = catMap[siteId] || {}, 
            catIdLen = catId.length, 
            catOneChar = '', catArr = [],
            selectedCat, catArrLen,
            catEtc = catmap.etc || catMap.etc,

        isFoundedCat = function() {

            var selectedSubcat = catmap.subcat, 
                selectedCat, isFound;

            if (selectedSubcat)
                selectedCat = selectedSubcat[catOneChar];

            isFound = selectedCat ? true : false;

            return isFound;     
        };

        catEtc.id = dzo.categoryId;
        
        for (var i=0; i<catIdLen; i++) {

            catOneChar += catId[i];        

            if (isFoundedCat()) {

                selectedCat = catmap.subcat[catOneChar];

                selectedCat.id = catOneChar;
                catmap = selectedCat;
                catOneChar = '';
                
                catArr.push(selectedCat);              
            }
        } 

        catArrLen = catArr.length;
        dzo.category = catArr[0] || catEtc;

        if (catArrLen > 1)
            dzo.subcategory = catArr[catArrLen - 1];

        else
            dzo.subcategory = dzo.category.subcat[0];
    };

    //category etc
    catMap.etc = catMap[1].etc = {ko_name: '종합', subcat: {}};
    catMap[5].etc = {ko_name: '포토', en_name: 'photo', subcat: {}};
    catMap[60].etc = {ko_name: '비즈', en_name: 'biz', subcat: {}};
    catMap[91].etc = {ko_name: '프리미엄', en_name: 'premium', subcat: {}};

    //category map
    //카테고리 팝업에서 종합이 제일 위에 뜨도록 0번 key에 할당    
    catMap[1].subcat = {

        1:
        {
            ko_name: '경제',
            en_name: 'economy',        
            subcat: 
            {
                1: { ko_name: '증권ㆍ금융'},
                2: { ko_name: '부동산'},
                3: { ko_name: '재테크'},
                4: { ko_name: '취업·채용·창업'},
                5: { ko_name: '유통ㆍ소비자'},
                6: { ko_name: 'IT'},              
                7: { ko_name: '경제정책'},
                8: { ko_name: '글로벌경제'},
                9: { ko_name: '자동차'},
                A: { ko_name: '핫경제인' },
                L: { ko_name: '기업' },
                M: { ko_name: '산업' },
                N: { ko_name: '위클리비즈' },
                O: { ko_name: '디지털비즈' },
                Q: { ko_name: '뉴스블로그' },
                R: { ko_name: '모닝커피' },
                S: { ko_name: '과학' },
                T: { ko_name: 'Forbes.com' },
                V: { ko_name: '캐피탈마켓' },
                W: { ko_name: '보도자료' },

                0: catMap[1].etc
            }
        },

        2:
        {
            ko_name: '정치',
            en_name: 'politics',
            subcat: {               

                1: { ko_name: '국회ㆍ정당' },
                2: { ko_name: '북한' },
                3: { ko_name: '정부ㆍ지자체' },
                4: { ko_name: '청와대' },
                5: { ko_name: '외교' },
                7: { ko_name: '정가 말말말(言)' },

                0: catMap[1].etc
            }
        },

        3:
        {
            ko_name: '사회',
            en_name: 'national',
            subcat: {

                1: { ko_name: '법원ㆍ검찰ㆍ경찰' },
                2: { ko_name: '교육ㆍ시험' },
                7: { ko_name: '환경ㆍ재해' },
                8: { ko_name: '날씨' },
                A: { ko_name: '사건ㆍ사고' },
                B: { ko_name: '국방' },
                C: { ko_name: '교통ㆍ관광ㆍ항공' },
                D: { ko_name: '노동ㆍ복지' },
                E: { ko_name: '우리이웃' },
                F: { ko_name: '전국뉴스' },
                N: { ko_name: '사람들' },
                S: { ko_name: '의료ㆍ보건' },
                W: { ko_name: '리빙포인트' },

                0: catMap[1].etc
            }
        },

        4:
        {
            ko_name: '국제',
            en_name: 'international',
            subcat: 
            {
                1: { ko_name: '아시아' },
                2: { ko_name: '미국ㆍ중남미' },
                3: { ko_name: '유럽' },
                4: { ko_name: '중동ㆍ아프리카' },
                5: { ko_name: '국제기구ㆍ회의' },     
                7: { ko_name: '해외화제' },                                
                8: { ko_name: '대양주' },

                0: catMap[1].etc
            }
        },

        5:
        {
            ko_name: '문화',    
            en_name: 'culture',
            subcat: {

                1: { ko_name: '건강정보' },
                2: { ko_name: '북스' },
                9: { ko_name: '미디어' },
                A: { ko_name: '종교ㆍ학술' },
                B: { ko_name: '문화인물' },
                C: { ko_name: '바둑' },
                D: { ko_name: '생활ㆍ여성' },
                F: { ko_name: '문화가산책' },
                G: { ko_name: '전시ㆍ공연' },
                N: { ko_name: '디자인' },
                O: { ko_name: '오늘의 운세' },

                0: catMap[1].etc
            }
        },        

        61:
        {
            ko_name: '사내칼럼',
            subcat: 
            {
                1: { ko_name: '김대중 칼럼' },
                3: { ko_name: '만물상' },      
                4: { ko_name: '기자수첩' },
                6: { ko_name: '여론조사' },
                8: { ko_name: '데스크에서' },
                B: { ko_name: '하영선 칼럼' },
                C: { ko_name: '장한나 칼럼' },
                D: { ko_name: '팔면봉' },   
                E: { ko_name: '강천석 칼럼' },
                F: { ko_name: '태평로' },
                G: { ko_name: '특파원칼럼' },
                I: { ko_name: '양상훈 칼럼' },
                J: { ko_name: '홍준호 칼럼' },
                N: { ko_name: '김창균 칼럼' },
                S: { ko_name: '박두식 칼럼' },
                U: { ko_name: '동서남북' },
                V: { ko_name: 'News Cartoon' },
                W: { ko_name: '한삼희 칼럼' },
                X: { ko_name: '최보식 칼럼' },

                0: catMap[1].etc
            }
        },

        62:
        {
            ko_name: '사외칼럼',
            subcat:
            {
                1: 
                {
                    ko_name: '시론ㆍ기고',
                    subcat:
                    {
                        1: { ko_name: '朝鮮칼럼<br>The Column' }
                    }
                },
                3: { ko_name: '일사일언' },
                4: { ko_name: '독자의견' },
                7: { ko_name: '조용헌 살롱' },
                9: { ko_name: '이덕일 사랑' },
                B: { ko_name: '하영선 칼럼' },
                C: { ko_name: '장한나 칼럼' },
                D: { ko_name: '문화비전' },
                E: { ko_name: '경제초점' },
                G: { ko_name: '동아시아 칼럼' },
                b: { ko_name: '발언대' },
                c: { ko_name: '아침편지' },

                0: catMap[1].etc
            }           
        },

        7: 
        {
            ko_name: '사고',
            subcat:
            {
                1: { ko_name: '조선일보 사고' },
                2: { ko_name: '조선닷컴 알림' },
                3: { ko_name: '이벤트공지' },
                4: { ko_name: '바로잡습니다' },
            }
        },

        G11:
        {
            ko_name: '야구',
            subcat:
            {
                1: { ko_name: 'MLB' },
                2: { ko_name: '프로야구' },
                3: { ko_name: '일본프로야구' },
                4: { ko_name: 'WBC' },

                0: catMap[1].etc
            }
        },

        G12:
        {
            ko_name: '축구',
            subcat:
            {
                1: { ko_name: '국가대표팀' },
                2: { ko_name: '프로축구' },
                3: { ko_name: '해외축구' },
                4: { ko_name: '해외파' },
                5: { ko_name: '유로' },

                0: catMap[1].etc
            }
        },

        G13:
        {
            ko_name: '종합',
            subcat:{

                5: { ko_name: '태권도' },
                6: { ko_name: '런앤런' },
                8: { ko_name: 'GA' },
                9: { ko_name: '하계' },
                A: { ko_name: '동계' },
                B: { ko_name: '바둑' },
                C: { ko_name: '대구육상' },
                D: { ko_name: '격투기' },

                0: catMap[1].etc
            }
        },

        G14:
        {
            ko_name: '핫포토',            
            subcat: {

                0: catMap[1].etc
            }
        },

        G1H:
        {
            ko_name: '농구',
            subcat:
            {
                1: { ko_name: 'NBA' },
                2: { ko_name: '남자농구' },
                3: { ko_name: '여자농구' },               

                0: catMap[1].etc
            }
        },

        G1I:
        {
            ko_name: '배구',
            subcat:
            {
                1: { ko_name: '남자배구' },
                2: { ko_name: '여자배구' },               

                0: catMap[1].etc
            }
        },

        G1J:
        {
            ko_name: '골프',
            subcat:
            {
                1: { ko_name: 'KPGA' },
                2: { ko_name: 'PGA' },
                3: { ko_name: 'KLPGA' },
                4: { ko_name: 'LPGA' },               

                0: catMap[1].etc
            }
        },

        G21:
        {
            ko_name: '연예',
            subcat:
            {
                1: { ko_name: '연예뉴스' },
                2: { ko_name: '이슈' },
                4: { ko_name: '해외연예' },
                5: { ko_name: 'TV/방송' },
                6: { ko_name: '음악' },

                0: catMap[1].etc
            }
        },

        G22:
        {
            ko_name: '영화',
            subcat:
            {
                1: { ko_name: '영화뉴스' },
                2: { ko_name: '영화리뷰' },
                A: { ko_name: '이벤트' },
                B: { ko_name: '영화정보' },

                0: catMap[1].etc
            }
        },

        G27:
        {
            ko_name: 'TV/방송',
            subcat:
            {
                1: { ko_name: '드라마' },
                2: { ko_name: '예능' },
                3: { ko_name: '시사/교양' },

                0: catMap[1].etc
            }
        }
    };   

    dzo.categoryMap = catMap;
    dzo.setCategory = setCategory;

})(dzo);