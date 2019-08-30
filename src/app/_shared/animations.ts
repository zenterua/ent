import { style, animate, transition, group, query, state } from "@angular/animations";

export const animationHeader = [
    transition(':enter', [
        style({ opacity: '0' }),
        animate('0.5s cubic-bezier(0.8, 0, 0.2, 1)', style({ opacity: '1' }))
    ])
];

export const animationPopup = [

  transition(':enter', [
    style({ opacity: 0, transform: 'scale(1.2)' }),
    animate('0.5s cubic-bezier(0.8, 0, 0.2, 1)')
  ]),
  transition(':leave', [
    animate('0.5s cubic-bezier(0.8, 0, 0.2, 1)', style({ opacity: 0, transform: 'scale(1.2)' }))
  ]),
  state('*', style({  opacity: 1, transform: 'scale(1)' })),
];

export const slideUpDown = [
        state('inactive', style({
            height: 0, overflow: 'hidden'
        })),
        state('active', style({
            height: '*', overflow: 'visible'
        })),
        transition('inactive => active', animate('350ms ease-in-out' )),
        transition('active => inactive', animate('350ms ease-in-out' ))
];

export const voidSlideUpDown = [
	transition(':enter', [
		style( {
			height: 0,
			overflow: 'hidden',
		}),
		animate('350ms ease-in-out', style({
			height: '*',
			overflow: 'visible'
		}))
	]),
	transition(':leave', [
		animate('350ms ease-in-out', style({
			height: 0,
			overflow: 'hidden'
		}))
	])
];

export const routerAnimation = [
        transition('auth => *', [
            query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
            group([
                query(':enter', [
                    style({ opacity: '0' }),
                    animate('0.35s ease-in-out', style({ opacity: '1' })),
                ], { optional: true }),
                query(':leave', [
                    style({ opacity: '1' }),
                    animate('0.35s ease-in-out', style({ opacity: '0' })),
                ], { optional: true }),
            ])
        ]),
        transition('* => auth', [

        ]),
        transition('* <=> *', [
            query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
            group([
                query(':enter', [
                    style({ opacity: '0' }),
                    animate('0.25s ease-in-out', style({ opacity: '1' })),
                ], { optional: true }),
                query(':leave', [
                    style({ opacity: '0' })
                ], { optional: true }),
            ])
        ])
];
export const itemAnimation = [
    transition(':enter', [
        style({ opacity: 0}),
        animate('0.5s 0.4s cubic-bezier(0.8, 0, 0.2, 1)', style({
            opacity: 1
        }))
    ])
];
