import { cloneDeep } from 'lodash';
import { ConstantVariableModel } from '../types';
import { dispatch } from '../../../store/store';
import { setOptionAsCurrent, setOptionFromUrl } from '../state/actions';
import { VariableAdapter } from '../adapters';
import { constantVariableReducer, initialConstantVariableModelState } from './reducer';
import { ConstantVariableEditor } from './ConstantVariableEditor';
import { updateConstantVariableOptions } from './actions';
import { optionPickerFactory } from '../pickers';
import { toDashboardVariableIdentifier } from '../utils';

export const createConstantVariableAdapter = (): VariableAdapter<ConstantVariableModel> => {
  return {
    id: 'constant',
    description: 'Define a hidden constant variable, useful for metric prefixes in dashboards you want to share.',
    name: 'Constant',
    initialState: initialConstantVariableModelState,
    reducer: constantVariableReducer,
    picker: optionPickerFactory<ConstantVariableModel>(),
    editor: ConstantVariableEditor,
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
      await dispatch(updateConstantVariableOptions(toDashboardVariableIdentifier(variable)));
    },
    getSaveModel: (variable) => {
      const { index, id, state, global, current, options, stateKey, ...rest } = cloneDeep(variable);
      return rest;
    },
    getValueForUrl: (variable) => {
      return variable.current.value;
    },
    beforeAdding: (model) => {
      const { current, options, query, ...rest } = cloneDeep(model);
      const option = { selected: true, text: query, value: query };

      return { ...rest, current: option, options: [option], query };
    },
  };
};
