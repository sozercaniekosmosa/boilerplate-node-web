import {create} from 'zustand';
import React, {memo} from 'react';

interface StoreState {
    parent: {
        value: string;
        child: {
            value: string;
            grandchild: {
                value: string;
            };
        };
    };
    setParentValue: (value: string) => void;
    setChildValue: (value: string) => void;
    setGrandchildValue: (value: string) => void;
}

const useStore = create<StoreState>((set) => ({
    parent: {
        value: '',
        child: {
            value: '',
            grandchild: {
                value: '',
            },
        },
    },
    setParentValue: (value) =>
        set((state) => ({
            parent: {...state.parent, value},
        })),
    setChildValue: (value) =>
        set((state) => ({
            parent: {
                ...state.parent,
                child: {...state.parent.child, value},
            },
        })),
    setGrandchildValue: (value) =>
        set((state) => ({
            parent: {
                ...state.parent,
                child: {
                    ...state.parent.child,
                    grandchild: {...state.parent.child.grandchild, value},
                },
            },
        })),
}));

const ParentComponent = () => {
    const value = useStore((state) => state.parent.value);
    const setParentValue = useStore((state) => state.setParentValue);

    return (
        <div style={{padding: '20px', border: '1px solid blue'}}>
            <h2>Parent Component</h2>
            <input
                value={value}
                onChange={(e) => setParentValue(e.target.value)}
                placeholder="Parent input"
            />
            <ChildComponent/>
            <p>{Date.now()}</p>
        </div>
    );
};

const ChildComponent = memo(() => {
    const value = useStore((state) => state.parent.child.value);
    const setChildValue = useStore((state) => state.setChildValue);

    return (
        <div style={{padding: '20px', border: '1px solid green', margin: '10px'}}>
            <h3>Child Component</h3>
            <input
                value={value}
                onChange={(e) => setChildValue(e.target.value)}
                placeholder="Child input"
            />
            <GrandchildComponent/>
            <p>{Date.now()}</p>
        </div>
    );
});

const GrandchildComponent = memo(() => {
    const value = useStore((state) => state.parent.child.grandchild.value);
    const setGrandchildValue = useStore((state) => state.setGrandchildValue);

    return (
        <div style={{padding: '20px', border: '1px solid red', margin: '10px'}}>
            <h4>Grandchild Component</h4>
            <input
                value={value}
                onChange={(e) => setGrandchildValue(e.target.value)}
                placeholder="Grandchild input"
            />
        </div>
    );
});

export const Zustand = () => {
    return (
        <div style={{padding: '20px'}}>
            <h1>Nested Components with Zustand</h1>
            <ParentComponent/>
            <p>{Date.now()}</p>
        </div>
    );
};

export default Zustand;