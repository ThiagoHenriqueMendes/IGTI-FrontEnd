let arrayDevs = [];

const itemHTML = `
<div class="col s4" id="{idDivPrincipal}">
<div class="card-panel grey lighten-5 z-depth-1">
  <div class="row valign-wrapper">
    <div class="col s2">
      <img src="{idPCTDEV}" class="circle responsive-img" />
    </div>
    <div class="col s12">
      <span class="black-text">
        <b>{nameDev}.</b> </span
      ><br />
      {divLanguages}
     
    </div>
  </div>
</div>
</div>`;
const language = ` <div class="col s2" id="{idDivLanguage}">
<img src="{idIMGLanguage}" alt="" class="circle responsive-img" />
</div>`;

window.addEventListener('load', async () => {
  const setEvents = () => {
    let txtBusca = document.querySelector('#txtBusca');
    txtBusca.addEventListener('keyup', (event) => {
      //espaço
      let valueTxt = event.target.value.toLowerCase();
      while (valueTxt.includes(' ')) {
        valueTxt = valueTxt.replace(' ', '');
      }

      if (event.keyCode === 13) BuscaDevs(valueTxt);
    });
  };
  arrayDevs = JSON.parse(
    JSON.stringify(await axios.get(' http://localhost:3001/devs'))
  );
  setEvents();
});

async function BuscaDevs(valueTxt) {
  let isJava = document.querySelector('#chkJava').checked;
  let isJavaScript = document.querySelector('#chkJavaScript').checked;
  let isPython = document.querySelector('#chkPyton').checked;
  let rdlAnd = document.querySelector('#rdlAnd').checked;

  let Retults = await arrayDevs.data.map((item) => {
    let conditionAccepted = true;
    const { id, name, picture, programmingLanguages } = item;
    if (rdlAnd) {
      conditionAccepted = condidtionAnd(
        isJava,
        isJavaScript,
        isPython,
        valueTxt,
        item
      );
    } else {
      conditionAccepted = condidtionOR2(
        isJava,
        isJavaScript,
        isPython,
        valueTxt,
        item
      );
    }
    if (conditionAccepted) {
      return {
        id: id,
        name: name,
        picture: picture,
        languages: programmingLanguages.map((itemLanguage) => {
          return {
            language: itemLanguage.language,
          };
        }),
      };
    }
  });
  Retults = Retults.filter((item) => {
    return item !== undefined;
  });

  PopulaCampos(Retults);
}

function PopulaCampos(Retults) {
  let h1Count = document.querySelector('#h1CountDevs');
  h1Count.textContent = Retults.length + ' dev(s) encontrados!';
  h1Count.style.display = 'inline';

  let txtGrid = document.querySelector('#rowGrid');
  txtGrid.innerHTML = '';
  txtGrid.innerHTML = GeraHTML(Retults);
}

function GeraHTML(Retults) {
  console.log(Retults);
  let gridHTML = '';
  Retults.forEach((element) => {
    const { id, name, picture, languages } = element;

    let languagesHTML = '';

    languages.forEach((element1) => {
      languagesHTML += language.replace('{idDivLanguage}', element1.language);
      if (element1.language === 'Java')
        languagesHTML = languagesHTML.replace(
          '{idIMGLanguage}',
          'img/java.png'
        );
      else if (element1.language === 'JavaScript')
        languagesHTML = languagesHTML.replace(
          '{idIMGLanguage}',
          'img/javascript.png'
        );
      else
        languagesHTML = languagesHTML.replace(
          '{idIMGLanguage}',
          'img/python.png'
        );
    });

    gridHTML += itemHTML
      .replace('{idDivPrincipal}', id)
      .replace('{idPCTDEV}', picture)
      .replace('{nameDev}', name)
      .replace('{divLanguages}', languagesHTML);
  });

  return gridHTML;
}
const condidtionOR = (isJava, isJavaScript, isPython, valueTxt, itemMap) => {
  let conditionAccepted = false;
  const { name, programmingLanguages } = itemMap;

  if (
    // conditionAccepted &&
    isJava &&
    constainsLanguage(programmingLanguages, 'Java')
  ) {
    conditionAccepted = true;
  } else if (
    // conditionAccepted &&
    isJavaScript &&
    constainsLanguage(programmingLanguages, 'JavaScript')
  ) {
    conditionAccepted = true;
  } else if (
    // conditionAccepted &&
    isPython &&
    constainsLanguage(programmingLanguages, 'Python')
  ) {
    conditionAccepted = true;
  }

  if (conditionAccepted && valueTxt.length > 0) {
    let nameTolower = name.toLowerCase().replace(' ', '');
    if (nameTolower.includes(valueTxt) === false) conditionAccepted = false;
  }
  return conditionAccepted;
};

const condidtionAnd = (isJava, isJavaScript, isPython, valueTxt, itemMap) => {
  let conditionAccepted = true;
  const { name, programmingLanguages } = itemMap;
  console.log('condition2');
  if (
    conditionAccepted &&
    isJava &&
    constainsLanguage(programmingLanguages, 'Java') === false
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = false;
  } else if (
    conditionAccepted &&
    isJava === false &&
    constainsLanguage(programmingLanguages, 'Java')
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = false;
  }
  //-------------------------------------------------------------------------------
  if (
    conditionAccepted &&
    isJavaScript &&
    constainsLanguage(programmingLanguages, 'JavaScript') === false
  ) {
    console.log('entrou aqui no JavaScript');
    conditionAccepted = false;
  } else if (
    conditionAccepted &&
    isJavaScript === false &&
    constainsLanguage(programmingLanguages, 'JavaScript')
  ) {
    console.log('entrou aqui no JavaScript');
    conditionAccepted = false;
  } //-------------------------------------------------------------------------------
  if (
    conditionAccepted &&
    isPython &&
    constainsLanguage(programmingLanguages, 'Python') === false
  ) {
    console.log('entrou aqui no python');
    conditionAccepted = false;
  } else if (
    conditionAccepted &&
    isPython === false &&
    constainsLanguage(programmingLanguages, 'Python')
  ) {
    console.log('entrou aqui no python');
    conditionAccepted = false;
  }
  //-------------------------------------------------------------------------------

  if (conditionAccepted && valueTxt.length > 0) {
    let nameTolower = name.toLowerCase().replace(' ', '');
    if (nameTolower.includes(valueTxt) === false) conditionAccepted = false;
  }
  return conditionAccepted;
};

const condidtionOR2 = (isJava, isJavaScript, isPython, valueTxt, itemMap) => {
  let conditionAccepted = true;
  const { name, programmingLanguages } = itemMap;
  if (
    conditionAccepted &&
    isJava &&
    constainsLanguage(programmingLanguages, 'Java')
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = true;
  } else if (
    conditionAccepted &&
    isJava === false &&
    constainsLanguage(programmingLanguages, 'Java')
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = false;
  }
  //-------------------------------------------------------------------------------

  if (
    conditionAccepted &&
    isJavaScript &&
    constainsLanguage(programmingLanguages, 'JavaScript')
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = true;
  } else if (
    conditionAccepted &&
    isJavaScript === false &&
    constainsLanguage(programmingLanguages, 'JavaScript')
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = false;
  }
  //-------------------------------------------------------------------------------
  if (
    conditionAccepted &&
    isPython &&
    constainsLanguage(programmingLanguages, 'Python')
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = true;
  } else if (
    conditionAccepted &&
    isPython === false &&
    constainsLanguage(programmingLanguages, 'Python')
  ) {
    console.log('entrou aqui no Java');
    conditionAccepted = false;
  }
  //-------------------------------------------------------------------------------

  if (conditionAccepted && valueTxt.length > 0) {
    let nameTolower = name.toLowerCase().replace(' ', '');
    if (nameTolower.includes(valueTxt) === false) conditionAccepted = false;
  }
  return conditionAccepted;
};

const constainsLanguage = (lstLanguages, language) => {
  return lstLanguages.some((itemLanguage) => {
    return itemLanguage.language === language;
  });
};
