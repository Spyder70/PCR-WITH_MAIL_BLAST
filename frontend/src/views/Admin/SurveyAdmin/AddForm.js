import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Preview from './Preview';

const DraggableBlock = ({ id, formIndex, name, type, index, moveBlock, isRequired, numButtons, buttonNames, options }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'BLOCK',
    item: { id, formIndex, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // Disable the drag
    canDrag: false,
  });
  
  console.log(isDragging);
  
  const [, drop] = useDrop({
    accept: 'BLOCK',
    hover(item, monitor) {
      // Disable the hover
    },
  });

  const isFormname = type === 'formname';
  const isButton = type === 'button';
  const isCheckbox = type === 'checkbox';
  const isRadio = type === 'radio';
  const isDropdown = type === 'dropdown';



  return (
    <div
    ref={(node) => (isFormname ? null : drag(drop(node)))}
    className={`draggable-block ${isButton ? 'button-block' : ''} ${isFormname ? 'formname-block' : ''} ${isCheckbox ? 'checkbox-block' : ''} ${isRadio ? 'radio-block' : ''} ${isDropdown ? 'dropdown-block' : ''}`}
    style={{ border: isButton || isFormname ? 'none' : '' }}
  >
    {isFormname ? (
      <label className={`formname-label ${isRequired ? 'required-field' : ''}`}>{name}</label>
    ) : isButton ? (
      <div className="button-wrapper">
        <button>{name}</button>
      </div>
    ) : (
      <>
        <p>
          {name}
          {isRequired && <span className="required-star">*</span>}
        </p>
        {isCheckbox || isRadio ? (
          <div className={`option-row ${isCheckbox ? 'checkbox-row' : 'radio-row'}`}>
            {Array.from({ length: numButtons }, (_, buttonIndex) => (
              <div key={buttonIndex} className="option-item">
                <input type={isCheckbox ? 'checkbox' : 'radio'} id={`button_${index}_${buttonIndex}`} name={`button_${index}`} />
                <label htmlFor={`button_${index}_${buttonIndex}`}>{buttonNames[buttonIndex]}</label>
              </div>
            ))}
          </div>
        ) : isDropdown ? (
          <div>
            <select>
              {options.map((option, optionIndex) => (
                <option key={optionIndex}>{option}</option>
              ))}
            </select>
          </div>
        ) : (
          <input type={type} placeholder={`Enter ${type} here`} required={isRequired} />
        )}
      </>
    )}
  </div>
);
};

const AddForm = () => {
  const [forms, setForms] = useState([]);
  const [activeFormIndex, setActiveFormIndex] = useState(null);
  const [blockName, setBlockName] = useState('');
  const [blockType, setBlockType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);
  const [numButtons, setNumButtons] = useState('');
  const [buttonNames, setButtonNames] = useState([]);
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');

  const isCheckboxOrRadio = blockType === 'checkbox' || blockType === 'radio';
  const setNumButtonsAndUpdateNames = (newNumButtons) => {
    newNumButtons = newNumButtons.trim();
    if (newNumButtons !== '' && (isNaN(newNumButtons) || parseInt(newNumButtons) <= 0)) {
      alert('Please enter a valid positive integer for the number of buttons.');
      return;
    }

    const numButtonsValue = newNumButtons === '' ? 0 : parseInt(newNumButtons);

    if (numButtonsValue > 20) {
      alert('Sorry, the maximum button limit is 20.');
      return;
    }

    const newButtonNames = Array.from({ length: numButtonsValue }, (_, index) => buttonNames[index] || '');
    setNumButtons(numButtonsValue.toString());
    setButtonNames(newButtonNames);
  };

  const addOption = () => {
    if (newOption.trim() !== '') {
      setOptions([...options, newOption]);
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const addBlock = () => {
    if (activeFormIndex === null) {
      alert('Please add a form first then you can add blocks.');
      return;
    }

    if (
      blockName.trim() === '' ||
      blockType.trim() === '' ||
      (isCheckboxOrRadio && numButtons <= 0) ||
      (blockType !== 'formname' && blockType !== 'button' && isRequired === '')
    ) {
      alert('Please fill in all the fields.');
      return;
    }

    const isButtonAlreadyAdded = forms[activeFormIndex].blocks.some((block) => block.type === 'button');
    if (blockType === 'button' && isButtonAlreadyAdded) {
      alert('Only one button is allowed per form!');
      return;
    }

    if (isCheckboxOrRadio && buttonNames.some((name) => name.trim() === '')) {
      alert('Please fill in all the fields for checkbox or radio buttons.');
      return;
    }

    if (blockType === 'dropdown' && options.length === 0) {
      alert('Please add at least one option for the dropdown.');
      return;
    }

    const newBlock = {
      name: blockName,
      type: blockType,
      isRequired: isRequired,
      numButtons: numButtons,
      buttonNames: buttonNames.slice(0, numButtons),
      options: options,
    };

    const updatedForm = { ...forms[activeFormIndex] };
    updatedForm.blocks.push(newBlock);

    const updatedForms = [...forms];
    updatedForms[activeFormIndex] = updatedForm;

    setBlockName('');
    setBlockType('text');
    setIsRequired(false);
    setNumButtons('');
    setButtonNames([]);
    setOptions([]);
    setNewOption('');

    setForms(updatedForms);
  };

  
  const moveBlock = (dragIndex, hoverIndex, formIndex) => {
    const newForms = [...forms];

    if (formIndex >= 0 && formIndex < newForms.length) {
      const [draggedBlock] = newForms[formIndex].blocks.splice(dragIndex, 1);

      if (draggedBlock) {
        if (!draggedBlock.hasOwnProperty('type')) {
          console.error('Block is missing:', draggedBlock);
          return;
        }

        if (!newForms[formIndex].hasOwnProperty('blocks')) {
          console.error('Form is missing the "blocks" property:', newForms[formIndex]);
          return;
        }

        if (draggedBlock.type === 'formname') {
          newForms.unshift(draggedBlock);
        } else {
          newForms[formIndex].blocks.splice(hoverIndex, 0, draggedBlock);
        }

        setForms(newForms);
      }
    }
  };



  const addForm = () => {
    if (activeFormIndex !== null) {
      alert('Please deactivate the existing form before adding a new one.');
      return;
    }

    const newForm = { blocks: [] };
    setForms([...forms, newForm]);
    setActiveFormIndex(forms.length);
  };

  const deleteForm = (formIndex) => {
    const updatedForms = forms.filter((form, index) => index !== formIndex);
    setForms(updatedForms);
    setActiveFormIndex(null);
  };

  const deactivateForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].isActive = false;
    setForms(updatedForms);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
        <h1 style={{ color: 'rgb(61, 177, 249)', fontSize: '3em', marginBottom: '20px' }}>Custom Survey</h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <label style={{ marginRight: '10px', marginBottom: '10px', display: 'block' }}>
            Name for the Field:
            <input type="text" value={blockName} onChange={(e) => setBlockName(e.target.value)} style={{ width: '350px', padding: '8px', boxSizing: 'border-box' }} required />
          </label>

          <label style={{ marginRight: '10px', marginBottom: '10px', display: 'block' }}>
            Input Type:
            <select value={blockType} onChange={(e) => setBlockType(e.target.value)} style={{ width: '350px', padding: '8px', boxSizing: 'border-box' }}>
              <option value="formname">Formname</option>
              <option value="text">Text</option>
              <option value="date">Date</option>
              <option value="number">Number</option>
              <option value="dropdown">Drop Down</option>
              <option value="radio">Radio Button</option>
              <option value="checkbox">Check Box</option>
              <option value="textarea">Text Area</option>
              <option value="button">Button</option>
              <option value="email">Email</option>
            </select>
          </label>

          {blockType !== 'formname' && blockType !== 'button' && (
            <label style={{ marginBottom: '10px', display: 'block' }}>
              Is Required:
              <select value={isRequired} onChange={(e) => setIsRequired(e.target.value === 'true')} style={{ width: '350px', padding: '8px', boxSizing: 'border-box' }}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
          )}
        </div>

        {isCheckboxOrRadio ? (
          <div style={{ marginRight: '30px', marginBottom: '30px', display: 'block' }}>
            <label>
              Number of Buttons:
              <input
                type="text"
                value={numButtons}
                onChange={(e) => setNumButtonsAndUpdateNames(e.target.value)}
                style={{ width: '350px', padding: '8px', boxSizing: 'border-box' }}
              />
            </label>

            {Array.from({ length: parseInt(numButtons) }, (_, buttonIndex) => (
              <label key={buttonIndex} style={{ display: 'block', marginBottom: '5px' }}>
                Button {buttonIndex + 1} Name:
                <input
                  type="text"
                  value={buttonNames[buttonIndex] || ''}
                  onChange={(e) => {
                    const newButtonNames = [...buttonNames];
                    newButtonNames[buttonIndex] = e.target.value;
                    setButtonNames(newButtonNames);
                  }}
                  required
                />
              </label>
            ))}
          </div>
        ) : blockType === 'dropdown' ? (
          <div style={{ marginBottom: '10px', display: 'block' }}>
            <label>
              Add Option Name:
              {options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <span>{option}</span>
                  <button
                    onClick={() => removeOption(optionIndex)}
                    style={{ marginRight: '30px', background: 'none' }}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <div>
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="New Option"
                />
                <button onClick={addOption} style={{ padding: '8px' }}>Add Option</button>
              </div>
            </label>
          </div>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
          <button onClick={addBlock} style={{ padding: '12px', backgroundColor: 'green', color: 'white', border: 'none', marginRight: '10px' }}>Add Block</button>
          <button onClick={addForm} style={{ padding: '12px', backgroundColor: '#008CBA', color: 'white', border: 'none' }}>Add Form</button>
        </div>

        {forms.map((form, formIndex) => (
          <div key={formIndex}>
            <br></br>
            <br></br>


            <h2 style={{ color: 'black', fontSize: '2em', textAlign: 'center' }}>Form {formIndex + 1}</h2>
            <div className="block-card">
              {form?.blocks?.map((block, index) => (
                <DraggableBlock
                  key={index}
                  formIndex={formIndex}
                  id={index}
                  index={index}
                  name={block.name}
                  type={block.type}
                  isRequired={block.isRequired}
                  moveBlock={moveBlock}
                  numButtons={block.numButtons}
                  buttonNames={block.buttonNames}
                  options={block.options}
                />
              ))}

            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                onClick={() => deleteForm(formIndex)}
                style={{ backgroundColor: form.isActive ? 'green' : '', color: 'white', padding: '8px', borderRadius: '4px' }}
              >
                Delete Form
              </button>
              <button
                onClick={() => deactivateForm(formIndex)}
                style={{
                  backgroundColor: !form.isActive ? 'green' : '',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  marginLeft: '10px',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Initial box shadow
                }}
                className="deactivate-button"
              >
                Activate
              </button>


            </div>
          </div>
        ))}
      </div>

      <br></br>
      <br></br>
      <div>
        <Preview forms={forms} />
      </div>
    </DndProvider>

  );
};

export default AddForm;