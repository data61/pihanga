
# Overview

Implements a simple Web UI to display the recent CPU  load as well as memory availability for the web server.

The UI consists of a single page showing two line charts, one
for the CPU load and one for the memory consumption.

Periodically the front end is querying a REST API provided by the serving web server for the most recent measurements.

## Building

To build the javascript bundle and front page, run the `yarn build`
script which will create all the necessary artifacts to run the UI
in the `build` directory.

## Running

    % yarn server

This will start a web server listening at port 8080, and pointing
your web browser at `http://__this_machine_name__:8080`. 

# How does it work?

As with all __Pihanga__ apps, the starting point is the [app.pihanga.js](src/app.pihanga.js) file which
declares all the used cards, their properties and how it fits together.

But before we have a look at that, we need to understand the workflow implemented by this app.

# FIX ME

As mentioned in the overview the app takes a user through three different step, `passport`, `spinner`, and `answer`. The currently active step is stored in the `step` property of the _Redux_ state (see [app.initial-state.js](src/app.initial-state.js)).

Now let us get back to [app.pihanga.js](src/app.pihanga.js) and look at the entry point `page`.

    page: {
        cardType: 'PiSimplePage',
        contentCard: s => s.step,
        ...
    },

`PiSimplePage` is a card provided by the standard __Pihanga__ library and provides ust minimal scaffolding for displaying a single child card identified through `contentCard`. In our case we
simply use the workflow `step` from the _Redux_ state.

The initial workflow state is `passport` and indeed we find a `passport` entry in [app.pihanga.js](src/app.pihanga.js):

    passport: {
        cardType: 'PiTitledPage',
        contentCard: 'form',
        ...
    },

    form: {
        cardType: 'PiForm',
        title: 'Ask the Ring',
        submitLabel: 'Send Query',
        fields: [
            ...
        ],
        ...
    },

![Passport Page](doc/passport.png)

The `passport` page consists of a titled page and an embedded form (`form`). Pressing the 'submit' button will trigger the default action:

    {
        type: "PI_FORM:FORM_SUBMIT"
        id: "form"
        passport: "44444"
        question: "0"
        ring: "0"
    }

which is 'reduced' in [workflow.js](src/workflow.js):

    register.reducer(actions('PiForm').FORM_SUBMIT, (state, action) => {
        dispatchFromReducer(() => {
            getPassportCount(action.passport);
        });
        const s = update(state, ['step'], 'spinner');
        return update(s, ['question'], action.question);
    });

The reducer first initiates an API call `getPassportCount`, and then changes both the `step`, as well 
as the `answer` property of the _Redux_ state. Changing the `step` property to `spinner` will, according 
to the `page.contentCard` declaration in [app.pihanga.js](src/app.pihanga.js), now display the `spinner` card 
which is defined as:

    spinner: {
        cardType: 'Spinner',
        ...
    },

'Spinner' is an application specific card and defined in the [spinner](src/spinner) directory.

![Spinner Page](doc/spinner.png)

The above referenced `getPassportCount` function will dispatch a `UPDATE_PASSPORT` event on successful
completion of the API request, which in turn is reduced in [workflow.js](src/workflow.js):

    register.reducer(ACTION_TYPES.UPDATE_PASSPORT, (state, action) => {
        const s = update(state, ['step'], 'answer');
        return update(s, ['answer'], action.reply);
    });

The first update is setting the step to `answer` which in turn will display the `answer` card defined in 
[app.pihanga.js](src/app.pihanga.js) as follows: 

    answer: {
        cardType: 'Answer',
        answer: s => s.answer,
        question: s => s.question,
    },

As with the `Spinner` card type, `Answer` is also an app specific card and defined in the [answer](src/answer) directory. It's properties `answer` and `question` are bound to the equally named properties in _Redux_.

![Answer Page](doc/answer.png)

Finally, the action `NEW_REQUEST` associated with the `NEW REQUEST` button on the answer page is reduced in 
[workflow.js](src/workflow.js) to return to the `passport` page:

    register.reducer(ANSWER_TYPES.NEW_REQUEST, (state) => {
        return update(state, ['step'], 'passport');
    });



# Developer

To further develop the UI start the development server with

    % yarn start

