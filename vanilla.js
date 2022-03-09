// Closure - para não ter auteração manual externa - função anonima
(function() {
  //Constante para o search/profile e pegar ela pelo DOM
  const search = document.getElementById("search");
  const profile = document.getElementById("profile");
  const button = document.getElementById('button');

  // Acesso criados no GitHub OAuth
  const url = "https://api.github.com/users";
  const client_id = "75871fd9aa05ab14287c";
  const client_secret = "ea4824db208481afb69184fc60735b08952c0b27";

  //Quantidade de repositorios e ordem de apresentação
  const count = 50;
  //const sort = "created: desc";

  //Por esperar a API responder, usei uma function async
  async function getUser(user) {
    const profileResponse = await fetch(
      `${url}/${user}?client_id=${client_id}&client_secret=${client_secret}`
    );
    const reposResponse = await fetch(
      `${url}/${user}/repos?per_page=${count}&client_id=${client_id}&client_secret=${client_secret}`
    );
    
    //convertendo para um JSON
    const profile = await profileResponse.json();
    const repos = await reposResponse.json();

    //retorna o atravez do getuser (virou objeto)
    return { profile, repos };
  }

  // Respostas vindas da API
  function showProfile(user) {
    profile.innerHTML = `
    <div class="row">
      <div class="col-md-4">
          <div class="card" style="width: 20rem;">
              <img class="card-img-top" src="${
                user.avatar_url
              }" alt="Card image cap">
              <ul class="list-group list-group-flush">
                  <li class="list-group-item">Repositórios: <span class="badge badge-success float-right">${
                    user.public_repos
                  }</span></li>                  
              </ul>
              <div class="card-body">
              <a href="${
                user.html_url
              }" target="_blank" class="btn btn-danger btn-block">Ver Perfil</a>
              </div>
          </div>
      </div>
      <div class="col-md-6">
          <div id="repos"></div>
      </div>
    </div>
    `;
  }

  function showRepos(repos) {
    let output = "";

    repos.forEach(repo => {
      output += `
          <div class="card card-body mb-2">
              <div class="row">
                  <div class="col-md-6">
                      <a href="${repo.html_url}" target="_blank">${
        repo.name
      }</a>
                  </div>
                  <div class="col-md-6 float-right">
                      <span class="badge badge-primary">Stars: ${
                        repo.stargazers_count
                      }</span>
                      <span class="badge badge-secondary">Watch: ${
                        repo.watchers_count
                      }</span>
                      <span class="badge badge-success">Forks: ${
                        repo.forks_count
                      }</span>
                  </div>
              </div>
          </div>
      `;
    });

    document.getElementById("repos").innerHTML = output;
  }
 
  // Ouvir o keyup e retorna pela arrow function //Colocar um evento de escuta  // e = callback
  search.addEventListener("click", e => {
    const user = e.target.value;    
    getUser(user).then(data => {
      console.log(data);
      if (data.message !== "Not Found") {
        showProfile(data.profile);
        showRepos(data.repos);
      }
    });
    
  });
})();
