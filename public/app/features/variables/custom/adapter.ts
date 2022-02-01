import { cloneDeep } from 'lodash';
import { CustomVariableModel } from '../types';
import { dispatch } from '../../../store/store';
import { setOptionAsCurrent, setOptionFromUrl } from '../state/actions';
import { VariableAdapter } from '../adapters';
import { customVariableReducer, initialCustomVariableModelState } from './reducer';
import { CustomVariableEditor } from './CustomVariableEditor';
import { updateCustomVariableOptions } from './actions';
import { isAllVariable, toDashboardVariableIdentifier } from '../utils';
import { optionPickerFactory } from '../pickers';
import { ALL_VARIABLE_TEXT } from '../constants';

export const createCustomVariableAdapter = (): VariableAdapter<CustomVariableModel> => {
  return {
    id: 'custom',
    description: 'Define variable values manually',
    name: 'Custom',
    initialState: initialCustomVariableModelState,
    reducer: customVariableReducer,
    picker: optionPickerFactory<CustomVariableModel>(),
    editor: CustomVariableEditor,
    dependsOn: () => {
      return false;
    },
    setValue: async (variable, option, emitChanges = false) => {
      await dispatch(setOptionAsCurrent(toDashboardVariableIdentifier(variable), option, emitChanges));
    },
    setValueFromUrl: async (variable, urlValue) => {
      await dispatch(setOptionFromUrl(toDashboardVariableIdentifier(variable), urlValue));
    },
    updateOptions: async (variable) => {
      await dispatch(updateCustomVariableOptions(toDashboardVariableIdentifier(variable)));
    },
    getSaveModel: (variable) => {
      const { index, id, state, global, stateKey, ...rest } = cloneDeep(variable);
      return rest;
    },
    getValueForUrl: (variable) => {
      if (isAllVariable(variable)) {
        return ALL_VARIABLE_TEXT;
      }
      return variable.current.value;
    },
  };
};
