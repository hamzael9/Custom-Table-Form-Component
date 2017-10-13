        class CustomFormComponent
        {

                constructor ( form, edit_action = '', delete_action = '', clearCallback = () => {} )
                {
                        this.form = form;
                        this.inputs = Array.from(this.form.getElementsByTagName('input'));
                        this.inputs = this.inputs.concat(Array.from(this.form.getElementsByTagName('select')));

                        this.defaultAction = this.form.action;
                        this.editAction = edit_action;
                        this.deleteAction = delete_action;

                        this.currentId = 0;

                        let clearBtn = this.form.getElementsByClassName('clear-btn')[0];
                        let deleteBtn = this.form.getElementsByClassName('delete-btn')[0];

                        if (clearBtn != undefined)
                                this.form.getElementsByClassName('clear-btn')[0].addEventListener( 'click', (e) => { e.preventDefault(); this.clearForm(clearCallback); } );
                        if (deleteBtn != undefined)
                                this.form.getElementsByClassName('delete-btn')[0].addEventListener( 'click', this.deleteBtnClickHandler.bind(this) );
                }

                deleteBtnClickHandler(e)
                {
                    this.form.action = this.deleteAction + this.currentId ;
                    this.form.dispatchEvent(new Event('submit'));
                }

                clearForm (clearCallback = () => {})
                {
                        for ( let field of this.inputs )
                                if (field.type !== 'hidden') field.value = "";
                        this.form.action = this.defaultAction;
                        clearCallback();
                }

                populateForm (obj, id)
                {
                        this.clearForm();
                        for (let input of this.inputs)
                        {
                                if (input.type === 'hidden')
                                {
                                        continue;
                                }
                                else
                                {
                                        for ( let key of Object.keys(obj) )
                                        {
                                                if( input.id.replace(/[-_\[\]]/g,'').includes(key) )
                                                {
                                                        if (input.type === 'checkbox')
                                                        {
                                                                if (obj[key] === 'true')
                                                                        input.checked = true;
                                                                else if (obj[key] === 'false')
                                                                        input.checked = false;
                                                        }
                                                        else
                                                        {
                                                                input.value = obj[key];
                                                                if (input.value != obj[key])
                                                                {
                                                                        if (input.type === 'select-one')
                                                                        {
                                                                                for (let option of input.options)
                                                                                {
                                                                                        if (option.text.trim() === obj[key].trim())
                                                                                        {
                                                                                                input.value = option.value;
                                                                                                break;
                                                                                        }
                                                                                }  
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                        this.currentId = id;
                        this.form.action = this.editAction + this.currentId;
                }
        }
