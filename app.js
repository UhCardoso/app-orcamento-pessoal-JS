class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano;
		this.mes = mes;
		this.dia = dia;
		this.tipo = tipo;
		this.descricao = descricao;
		this.valor = valor;
	}

	validarDados() {

		//validar se compos estao preenchidos
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false;
			}
		}

		//validar se os dias do mes vao de 1 a 31
		if(this.dia < 1 || this.dia > 31) {
			return false;
		}

		//velificar se o campo valor recebe apenas numero
		this.valor = this.valor.replace(',','.');
		if(this.valor > 0) {
			return true;
		} else {
			return false;
		}

		return true;
	}
}

class Bd {
	constructor() {
		let proximoId = localStorage.getItem('id');

		if(proximoId === null) {
			localStorage.setItem('id', 0);
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id');
		return parseInt(proximoId)+1;
	}

	gravar(d) {
		let id = this.getProximoId();
		
		localStorage.setItem(id, JSON.stringify(d));
		localStorage.setItem('id', id);
	}

	recuperarTodosRegistros() {
		//array de despesas
		let despesas = Array();

		let id = localStorage.getItem('id');

		//recuperar todas as despesas cadastradas
		for(let i = 1; i <= id; i++) {
			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i));

			//pular indices removidos
			if(despesa == null) {
				continue;
			}
			
			despesa.id = i;
			despesas.push(despesa);
		}

		return despesas;
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array();

		despesasFiltradas = this.recuperarTodosRegistros();

		//ano
		if(despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
		}

		//mes
		if(despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
		}

		//dia
		if(despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
		} 

		//tipo
		if(despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
		}

		//descricao
		if(despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
		}

		//valor
		if(despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
		}

		return despesasFiltradas;
	}

	remover(id) {
		localStorage.removeItem(id);
	}
}

let bd = new Bd();

function cadastrarDespesa() {
	let ano = document.getElementById('ano');
	let mes = document.getElementById('mes');
	let dia =document.getElementById('dia');
	let tipo = document.getElementById('tipo');
	let descricao = document.getElementById('descricao');
	let valor = document.getElementById('valor');

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	);

	if(despesa.validarDados()) {
		bd.gravar(despesa);
		//sucesso
		document.getElementById('modal_titulo').innerHTML = "Registro inserido com sucesso";
		document.getElementById('modal_titulo_div').className = "modal-header text-success";
		document.getElementById('modal_conteudo').innerHTML = "Despesa foi cadastrada com sucesso!";
		document.getElementById('modal_btn').innerHTML = "Voltar";
		document.getElementById('modal_btn').className = "btn btn-success";
		$('#modalRegistroDespesa').modal('show');

		//limpar campos apos salvar registro
		ano.value = "";
		mes.value = "";
		dia.value = "";
		tipo.value = "";
		descricao.value = "";
		valor.value = "";

	} else {
		//erro
		document.getElementById('modal_titulo').innerHTML = "Erro ao inserir registro";
		document.getElementById('modal_titulo_div').className = "modal-header text-danger";
		document.getElementById('modal_conteudo').innerHTML = "Campos obrigatórios não foram preenchidos corretamente!";
		document.getElementById('modal_btn').innerHTML = "Voltar e corrigir";
		document.getElementById('modal_btn').className = "btn btn-danger";
		$('#modalRegistroDespesa').modal('show');
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false, estadoExclusao = false, idExclusao = false) {
	if(despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros();

	}

	let listaDespesas = document.getElementById('listaDespesas');
	listaDespesas.innerHTML = '';

	let valorTotalDespesa = 0;

	//percorrer array despesas para lista-las de forma dinamica
	despesas.forEach((d) => {
		//criando a linha(tr)
		let linha = listaDespesas.insertRow();

		//criar colunas(td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

		//ajustar o tipo
		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break;

			case '2': d.tipo = 'Educação'
				break;

			case '3': d.tipo = 'Lazer'
				break;

			case '4': d.tipo = 'Saúde'
				break;

			case '5': d.tipo = 'Transporte'
				break;
		}
		
		linha.insertCell(1).innerHTML = d.tipo;
		linha.insertCell(2).innerHTML = d.descricao;
		linha.insertCell(3).innerHTML = 'R$'+d.valor.replace('.',',');

		//criar o botao excluir
		let btn = document.createElement('button');
		btn.className = 'btn btn-danger';
		btn.innerHTML = '<i class="fas fa-times"></i>';
		btn.id = 'id_despesa_' + d.id;
		btn.onclick = function() {
			document.getElementById('modal_titulo').innerHTML = "Excluir registro";
			document.getElementById('modal_titulo_div').className = "modal-header text-danger";
			document.getElementById('modal_conteudo').innerHTML = "Tem certeza que quer excluir registro?";
			document.getElementById('modal_btn1').innerHTML = "confirmar";
			document.getElementById('modal_btn1').className = "btn btn-success";
			document.getElementById('modal_btn1').id = d.id;
			document.getElementById('modal_btn2').innerHTML = "cancelar";
			document.getElementById('modal_btn2').className = "btn btn-danger";
			$('#confirmarExcluir').modal('show');
		}

		if(estadoExclusao == true) {
				//remover a despesa
				bd.remover(idExclusao);
				window.location.reload();
			}

		linha.insertCell(4).append(btn);

		//valor total despesa
		d.valor = d.valor.replace(',','.');
		valorTotalDespesa = valorTotalDespesa + parseFloat(d.valor); 
	})

	let totalDespesas = document.getElementById('rodapeTotalDespesas');
	valorTotalDespesa = valorTotalDespesa.toString().replace('.',',');
	totalDespesas.innerHTML = valorTotalDespesa

}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value;
	let mes = document.getElementById('mes').value;
	let dia = document.getElementById('dia').value;
	let tipo = document.getElementById('tipo').value;
	let descricao = document.getElementById('descricao').value;
	let valor = document.getElementById('valor').value;

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

	let despesas = bd.pesquisar(despesa);

	carregaListaDespesas(despesas, true);
}

function mudarEstadoExcluir(estadoExclusao, idExclusao) {
	carregaListaDespesas('','',estadoExclusao, idExclusao);
}

function recarregarModal() {
	window.location.reload();
}

function carregarIndicadores(despesas = Array()) {
	if(despesas.length == 0) {
		despesas = bd.recuperarTodosRegistros();
	}

	let listaDespesas = document.getElementById('listaIndicadoresTipo');
	listaDespesas.innerHTML = '';
	//soma valor total por tipo
	let gastoAlimentacao = 0;
	let gastoEducacao = 0;
	let gastoLazer = 0;
	let gastoSaude = 0;
	let gastoTransporte = 0;

	let gastoMes1 = 0;
	let gastoMes2 = 0;
	let gastoMes3 = 0;
	let gastoMes4 = 0;
	let gastoMes5 = 0;
	let gastoMes6 = 0;
	let gastoMes7 = 0;
	let gastoMes8 = 0;
	let gastoMes9 = 0;
	let gastoMes10 = 0;
	let gastoMes11 = 0;
	let gastoMes12 = 0;

	despesas.forEach((d) => {
		//verificar tipos
		if(d.tipo == 1) {
			gastoAlimentacao = gastoAlimentacao + parseFloat(d.valor);
		}

		if(d.tipo == 2) {
			gastoEducacao = gastoEducacao + parseFloat(d.valor);
		}

		if(d.tipo == 3) {
			gastoLazer = gastoLazer + parseFloat(d.valor);
		}

		if(d.tipo == 4) {
			gastoSaude = gastoSaude + parseFloat(d.valor);
		}

		if(d.tipo == 5) {
			gastoTransporte = gastoTransporte + parseFloat(d.valor);
		}

		//verificar mes
		if(d.mes == 1) {
			gastoMes1 = gastoMes1 + parseInt(d.valor);
		}

		if(d.mes == 2) {
			gastoMes2 = gastoMes2 + parseInt(d.valor);
		}

		if(d.mes == 3) {
			gastoMes3 = gastoMes3 + parseInt(d.valor);
		}

		if(d.mes == 4) {
			gastoMes4 = gastoMes4 + parseInt(d.valor);
		}

		if(d.mes == 5) {
			gastoMes5 = gastoMes5 + parseInt(d.valor);
		}

		if(d.mes == 6) {
			gastoMes6 = gastoMes6 + parseInt(d.valor);
		}

		if(d.mes == 7) {
			gastoMes7 = gastoMes7 + parseInt(d.valor);
		}

		if(d.mes == 8) {
			gastoMes8 = gastoMes8 + parseInt(d.valor);
		}

		if(d.mes == 9) {
			gastoMes9 = gastoMes9 + parseInt(d.valor);
		}

		if(d.mes == 10) {
			gastoMes10 = gastoMes10 + parseInt(d.valor);
		}

		if(d.mes == 11) {
			gastoMes11 = gastoMes11 + parseInt(d.valor);
		}

		if(d.mes == 12) {
			gastoMes12 = gastoMes12 + parseInt(d.valor);
		}
	});


	let listaIndicadores = document.getElementById('listaIndicadoresTipo');
	let linha = listaIndicadores.insertRow();
	//inserir gastos por tipo
	linha.insertCell(0).innerHTML = 'Gasto total:';
	linha.insertCell(1).innerHTML = 'R$'+gastoAlimentacao;
	linha.insertCell(2).innerHTML = 'R$'+gastoEducacao;
	linha.insertCell(3).innerHTML = 'R$'+gastoLazer;
	linha.insertCell(4).innerHTML = 'R$'+gastoSaude;
	linha.insertCell(5).innerHTML = 'R$'+gastoTransporte;

	//inserir gastos por meses
	document.getElementById('indicadorMes1').innerHTML = 'R$'+gastoMes1;
	document.getElementById('indicadorMes2').innerHTML = 'R$'+gastoMes2;
	document.getElementById('indicadorMes3').innerHTML = 'R$'+gastoMes3;
	document.getElementById('indicadorMes4').innerHTML = 'R$'+gastoMes4;
	document.getElementById('indicadorMes5').innerHTML = 'R$'+gastoMes5;
	document.getElementById('indicadorMes6').innerHTML = 'R$'+gastoMes6;
	document.getElementById('indicadorMes7').innerHTML = 'R$'+gastoMes7;
	document.getElementById('indicadorMes8').innerHTML = 'R$'+gastoMes8;
	document.getElementById('indicadorMes9').innerHTML = 'R$'+gastoMes9;
	document.getElementById('indicadorMes10').innerHTML = 'R$'+gastoMes10;
	document.getElementById('indicadorMes11').innerHTML = 'R$'+gastoMes11;
	document.getElementById('indicadorMes12').innerHTML = 'R$'+gastoMes12;
}