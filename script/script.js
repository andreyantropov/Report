window.onload = function () 
{
	/*Глобальные переменные*/
	let selectedTable, selectedRow, selectedCol;
	let buffer;

	let menu = document.getElementById('menu');
	let box = document.getElementsByClassName('table');
	
	/*Процедура нажатия на кнопку "Удалить"
	Выводит окно подтверждения операции. Если пользователь
	подтверждает удаление, то удаляет родительский элемент*/
	function createDeleteButtonEventListener()
	{
		document.getElementsByName("delete-button").forEach(function(item) 
		{
			item.addEventListener("click", function()
			{
				if(confirm("Вы точно хотите удалить этот элемент?"))
				{
					item.parentNode.parentNode.removeChild(item.parentNode);
				}
			});
		});	
	}
	
	/*Процедура, скрывающая выпадающее меню*/
	document.addEventListener('click', function(ev)
	{
		menu.classList.add('off');
		menu.style.top = '-200%';
		menu.style.left = '-200%';
	});
	
	/*Процедура, добавляющая в документ кнопку "Вверх, если пользователь
	пролистал документ вниз"*/
	document.defaultView.onscroll = function()
	{
		if(document.documentElement.scrollTop > document.documentElement.clientHeight) 
			document.getElementById("on-top").classList.add("active-top-button"); 
		else 
			document.getElementById("on-top").classList.remove("active-top-button");
	}
	
	/*Процедура пролистывания страницы вверх при нажатии
	на кнопку "Вверх"*/
	document.getElementById("on-top").onclick = function()
	{
		document.defaultView.scrollTo(0, 0);
	}
	
	/*Процедура нажатия на кнопку "Добавить текст"
	Добавляет в конце документа текстовое поле с заголовком*/
	document.getElementById("create-text").onclick = function()
	{
		//Создаем контейнер с текстовыми полями
		let div = document.createElement("div");
		div.className = "main-container";
		div.innerHTML = "<div class = 'col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12' contenteditable><h2>*Введите заголовок*</h2><p>*Введите текст*</p></div><button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>";
		//Добавляем конейнер в документ
		document.getElementById("clr").before(div);
		//Добавляем прослушивание событий
		createDeleteButtonEventListener();
	}
	
	/*Процедура нажатия на кнопку "Добавить картинку"
	Добавляет в конце документа текстовое поле с заголовком*/
	document.getElementById("create-image").onclick = function()
	{
		//Создаем контейнер для выбора картинки
		let div = document.createElement("div");
		div.className = "main-container";
		div.innerHTML = "<div class = 'col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'><input name = 'load-img' type='file' accept='image/*'><img></div><button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>";
		//Добавляем конейнер в документ
		document.getElementById("clr").before(div);
		//Добавляем прослушивание событий
		createImgEventListener();
		createDeleteButtonEventListener();
	}
	
	/*Процедура загрузки картинки на сайт*/
	function createImgEventListener()
	{
		document.getElementsByName("load-img").forEach(function(item) 
		{
			item.addEventListener("change", function()
			{
				let reader = new FileReader();
				reader.onload = function()
				{
					//Добавляем картинку
					let img = item.parentNode.getElementsByTagName("img")[0];
					img.src = reader.result;
					//Добавляем строку с описанием
					if(!item.parentNode.getElementsByTagName("p").length)
					{
						let description = document.createElement("p");
						description.className = "image-description";
						description.contentEditable = true;
						description.innerHTML = "*Введите комментарий*";
						img.after(description);
					}
				}
				reader.readAsDataURL(event.target.files[0]);
			});
		});
	}
	
	/*Процедура нажатия на кнопку "Создать таблицу"
	Открывает модальное окно ввода строк и столбцов и создает по
	этим данным соответствующую таблицу*/
	document.getElementById("create-table").onclick = function()
	{
		//Считывание строк и полей
		let rows = prompt("Кол-во строк:", 3);
		let cols = prompt("Кол-во столбцов:", 3);
		//Проверяем введенные значения
		if(!isInteger(rows) || (!isInteger(cols)))
		{
			alert("Введите целое число");
			return;
		}
		//Создаем таблицу
		let table = ["<div class = 'col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12' contenteditable><table class = 'table table-bordered'><thead class='thead-dark'><tr><th scope='col'></th>"];
		for(i = 0; i < cols; i++)
		{
			table.push("<th scope='col'></th>");
		}
		table.push("</tr></thead><tbody>")
		for(i = 0; i < rows; i++)
		{
			table.push("<tr><th scope = 'row'></th>");
			for(j = 0; j < cols; j++)
			{
				table.push("<td></td>");
			}
			table.push("</tr>");
		}
		table.push("</tbody></table></div><button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>");
		//Создаем контейнер с текстовыми полями
		let div = document.createElement("div");
		div.className = "main-container";
		div.innerHTML = table.join('\n');
		//Добавляем таблицу в документ
		document.getElementById("clr").before(div);
		//Добавляем прослушивание событий
		createTableEventListener();
		createDeleteButtonEventListener();
	}
	
	/*Процедура, добавляющая пользовательское выпадающее
	меню в таблицы пользователя*/
	function createTableEventListener()
	{
		box = document.getElementsByClassName('table');
		for(let i = 0; i < box.length; i++)
		{
			box[i].addEventListener('contextmenu', function(ev)
			{
				selectedTable = box[i];
				selectedRow = ev.target.parentNode.rowIndex;
				selectedCol = ev.target.cellIndex;
				
				ev.preventDefault(); 
				menu.style.top = `${ev.clientY - 20}px`;
				menu.style.left = `${ev.clientX - 20}px`;
				menu.classList.remove('off');
			});
		}
	}
	
	/*Процедура копирования данных в буфер обмена*/
	document.getElementById("copy").onclick = function()
	{
		buffer = selectedTable.rows[selectedRow].cells[selectedCol].innerHTML;
	}
	
	/*Процедура вставки данных*/
	document.getElementById("paste").onclick = function()
	{
		selectedTable.rows[selectedRow].cells[selectedCol].innerHTML = buffer;
	}
	
	/*Процедура добавления строки в таблицу*/
	document.getElementById("add-row").onclick = function()
	{
		//Создаем новую строку
		let newRow = document.createElement("tr");
		let newRowInner = "<tr><th scope = 'row'></th>";
		for(let i = 0; i < selectedTable.rows[0].cells.length - 1; i++)
		{
			newRowInner += "<td></td>";
		}
		newRowInner += "</tr>";
		newRow.innerHTML = newRowInner;
		//Добавляем строку в таблицу
		selectedTable.rows[selectedRow].after(newRow);
	}
	
	/*Процедура добавления столбца в таблицу*/
	document.getElementById("add-col").onclick = function()
	{
		//Создаем новый столбец
		let newColHeader = document.createElement("th");
		newColHeader.scope = "col";
		//Добавляем столбец в таблицу
		selectedTable.rows[0].cells[selectedCol].after(newColHeader);
		for(let i = 1; i < selectedTable.rows.length; i++)
		{
			selectedTable.rows[i].cells[selectedCol].after(document.createElement("td"));
		}
	}
	
	/*Процедура удаления строки из таблицы*/
	document.getElementById("remove-row").onclick = function()
	{
		selectedTable.deleteRow(selectedRow);
	}
	
	/*Процедура удаления столбца из таблицы*/
	document.getElementById("remove-col").onclick = function()
	{
		for(let i = 0; i < selectedTable.rows.length; i++)
		{
			selectedTable.rows[i].deleteCell(selectedCol);
		}
	}
	
	/*Процедура нажатия на кнопку "Добавить таблицу Excel"
	Добавляет в конце документа текстовое поле с заголовком*/
	document.getElementById("create-excel-table").onclick = function()
	{
		//Создаем контейнер для выбора картинки
		let div = document.createElement("div");
		div.className = "main-container";
		div.innerHTML = "<div class = 'col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'><input name = 'load-xml' type='file' accept='text/html'><div class = 'excel-container'></div></div><button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>";
		//Добавляем конейнер в документ
		document.getElementById("clr").before(div);
		//Добавляем прослушивание событий
		createExcelEventListener();
		createDeleteButtonEventListener();
	}
	
	/*Процедура загрузки таблицы Excel на сайт*/
	function createExcelEventListener()
	{
		document.getElementsByName("load-xml").forEach(function(item) 
		{
			item.addEventListener("change", function()
			{
				let reader = new FileReader();
				reader.onload = function()
				{
					//Добавляем таблицу Excel
					let xml = item.parentNode.getElementsByClassName("excel-container")[0];
					xml.innerHTML = reader.result;
				}
				reader.readAsText(event.target.files[0]);
			});
		});
	}
}

/*Процедура, проверяющая, является ли переменная num числовой*/
function isInteger(num) 
{
	return (num ^ 0) == num;
}


