
        class CustomTableComponent
        {
                constructor (table, filter = null, form=null)
                {
                        this.table = table;
                        this.table.addEventListener('click', this.tableClickEventHandler.bind(this))
                        this.rows = Array.from(this.table.getElementsByTagName('tr'));
                        this.currentId = 0;

                        this.filter = filter;
                        if (this.filter !== null)
                        {
                                this.filter.addEventListener('keyup', this.filterChangeHandler.bind(this));
                                this.filter.placeholder = 'field [space] value';
                                this.startFiltering = false;
                        }

                        this.form = form;

                }

                getRows ()
                {
                        return this.rows;
                }

                clearTableSelections()
                {
                        for (let row of this.rows)
                                row.classList.remove('selected');
                        this.currentId = 0;
                        if (this.form !== null)
                            this.form.clearForm();
                }

                getObjFromRow (row)
                {
                        let obj = {};
                        let cells = row.childNodes;
                        let fieldName = '';
                        
                        for (let cell of cells)
                        {
                                if ( !cell.tagName || cell.tagName.toLowerCase() !== 'td') // case of some crazy child not of type <td></td>
                                        continue; 
                                else if ( cell.tagName.toLowerCase() == 'th') // we are in the head of the table, no data here
                                {
                                        obj['id'] = -1;
                                        break; 
                                }

                                for (let className of cell.classList)
                                {
                                        if (className.startsWith('field'))
                                        {
                                                fieldName = className.split('-').slice(1).join('');
                                                break;
                                        }
                                }
                                obj['id'] = row.dataset.id;
                                if (cell.dataset.bool != undefined)
                                        obj[fieldName] = cell.dataset.bool;
                                else
                                        obj[fieldName] = cell.textContent;
                        }

                        return obj; 
                }

                tableClickEventHandler (e)
                {
                        if (e.target.tagName.toLowerCase() === 'td')
                        {
                                this.clearTableSelections();
                                let clickedRow = e.target.parentNode;
                                this.currentId = clickedRow.dataset.id;
                                //populateFormWithRow (clickedRow, formToPopulate);
                                clickedRow.classList.add('selected');
                                if (this.form !== null)
                                {
                                        this.form.populateForm(this.getObjFromRow(clickedRow), this.currentId);
                                }
                        }
                }

                filterChangeHandler (e)
                {
                        if ( e.target.value.trim() === '' )
                        {
                                this.startFiltering = false;
                                this.filterTable('',''); // remove all filters if there is
                        }
                        else if (e.keyCode === 32)
                        {
                                this.startFiltering = true;
                        }
                        else if (this.startFiltering)
                        {
                                let tmp = e.target.value.trim().split(' ');
                                if (tmp.length > 1)
                                {
                                    let field = tmp[0];
                                    let value = '';
                                    if (tmp.length === 2)
                                    {
                                        value = tmp[1];
                                    }
                                    else
                                    {
                                        tmp.splice(0,1);
                                        value = tmp.join(' ');
                                    }
                                    this.filterTable ( field, value );
                                }
                                else
                                    this.filterTable('','');
                        }
                }

                filterTable (field, value)
                {
                    //console.log(`searching field ${field} for ${value}`);
                        if (field === '' && value === '')
                        {
                                for (let row of this.rows)
                                        row.classList.remove('hidden');
                                return;
                        }

                        let tmpObj;
                        
                        for ( let row of this.rows )
                        {
                                tmpObj = this.getObjFromRow(row);
                                if (tmpObj['id'] > 0)
                                {
                                        for (let k of Object.keys(tmpObj) )
                                        {
                                                if (k.includes(field))
                                                {
                                                        if (tmpObj[k].toLowerCase().includes(value.toLowerCase()))
                                                                row.classList.remove('hidden');
                                                        else
                                                                row.classList.add('hidden');
                                                }
                                        }
                                }
                        }
                }

        }
