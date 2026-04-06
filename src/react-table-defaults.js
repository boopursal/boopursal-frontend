import "react-table/react-table.css";
import React, { Component } from 'react';
import { FormControl, Icon, IconButton, Input, InputAdornment, Box } from '@material-ui/core';
import { ReactTableDefaults } from 'react-table'

class FilterComponent extends Component {

    state = {
        filterValue: '',
    };

    changeFilterValue = (event) => {
        const value = event.target.value;
        this.setState({ filterValue: value });
        this.props.onChange(value);
    };

    render() {
        return (
            <div className="filter flex flex-col items-center">
                <FormControl className="w-full px-12">
                    <input
                        type="text"
                        onChange={this.changeFilterValue}
                        value={this.state.filterValue}
                        className="w-full px-12 py-8 bg-[#f6f9fc] border border-[#e9ecef] rounded-4 text-12 font-600 text-slate-700 placeholder-slate-400 focus:bg-white focus:border-blue-400 outline-none transition-all"
                        placeholder="Rechercher..."
                    />
                </FormControl>
            </div>
        );
    }
}

/**
 * React Table Defaults - Argon Edition
 */
Object.assign(ReactTableDefaults, {
    PreviousComponent: (props) => (
        <button {...props} className="w-36 h-36 border border-gray-200 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition-colors mx-4 text-gray-400 disabled:opacity-30">
            <Icon className="text-18">chevron_left</Icon>
        </button>
    ),
    NextComponent: (props) => (
        <button {...props} className="w-36 h-36 border border-gray-200 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition-colors mx-4 text-gray-400 disabled:opacity-30">
            <Icon className="text-18">chevron_right</Icon>
        </button>
    ),
    FilterComponent: (props) => (
        <FilterComponent {...props} />
    ),
    NoDataComponent: (props) => (
        <div className="flex flex-col items-center justify-center p-64 text-center">
            <div className="w-64 h-64 rounded-full bg-blue-50 flex items-center justify-center mb-16">
                <Icon className="text-32 text-blue-300">search_off</Icon>
            </div>
            <div className="font-700 text-16 text-slate-700">Aucun résultat</div>
            <div className="text-12 text-slate-400">Essayez d'ajuster vos critères de recherche.</div>
        </div>
    )
});
