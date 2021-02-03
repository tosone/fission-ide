# Tree view

The `src` directory layout.

``` txt
├── error.ts                  # error definition
├── extension.ts              # VSCode entry
├── lib                       # Fission-IDE library
│   ├── config                # config library
│   │   ├── get.ts            # get the fission url config
│   │   ├── index.ts          # method export
│   │   ├── model.ts          # some config definition
│   │   ├── test.ts           # test config is valid or not
│   │   └── update.ts         # update the config by command 'Fission config update'
│   ├── environents           # environments library
│   │   ├── del.ts            # delete some environments
│   │   ├── index.ts          # method export
│   │   └── provider.ts       # environment sidebar data provider
│   ├── functions             # function library
│   │   ├── del.ts            # delete some functions
│   │   ├── deploy.ts         # deploy file or dir to Fission as a function
│   │   ├── index.ts          # method export
│   │   ├── model.ts          # function model definition
│   │   └── provider.ts       # function sidebar data provider
│   └── packages              # package library
│       ├── create.ts         # create package
│       ├── del.ts            # delete some packages
│       ├── index.ts          # method export
│       ├── model.ts          # package model definition
│       └── provider.ts       # package sidebar data provider
└── view                      # web view
    ├── constants.ts          # some constants
    ├── functionDeploy        # function deploy web view
    │   ├── deploy.ts         # web view panel creator
    │   ├── model.ts          # message definition
    │   └── page              # web view
    │       ├── deploy.tsx    # page content
    │       ├── index.tsx     # web view entry
    │       └── tsconfig.json # typescript config
    ├── functionTest          # function test web view
    │   ├── model.ts          # message definition
    │   └── test.ts           # web view panel creator
    ├── index.scss            # css
    └── model                 # some definition
        └── index.ts          # some definition
```
