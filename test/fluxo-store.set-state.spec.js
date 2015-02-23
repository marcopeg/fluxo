
var Fluxo = require('../src/fluxo');

describe('FluxoStore // setState()', function() {

    var store;

    beforeEach(function() {
        store = Fluxo.createStore(true, {
            initialState: {
                name: 'Marco'
            }
        });
    });

    it('should change a single property identified by string', function() {
        store.setState('name', 'Silvia');
        expect(store.getState()).to.have.property('name').and.equal('Silvia');
    });

    it('should change a set of properties', function() {
        var newState = {
            name: 'Silvia',
            pet: 'Clody'
        };
        store.setState(newState);
        expect(store.getState()).to.deep.equal(newState);
    });

    it('should be aborted via mixin', function() {
        var store = Fluxo.createStore(true, {
            initialState: {a:1},
            mixins: [{
                beforeStateChange: function() {
                    this.setResult(false);
                }
            }]
        });
        store.setState({a:2});
        expect(store.getState()).to.deep.equal({a:1});
    });

    it('should modify the change via mixin', function() {
        var store = Fluxo.createStore(true, {
            initialState: {a:1},
            mixins: [{
                beforeStateChange: function(change) {
                    change.foo = 123;
                }
            }]
        });
        store.setState({a:2});
        expect(store.getState()).to.have.property('foo').that.equals(123);
    });

    it('should not affect an unmodified property', function() {
        var store = Fluxo.createStore(true, {
            initialState: {a:1},
        });
        var spy = sinon.spy();
        store.registerControllerView({
            setState: spy
        });
        store.setState('a',1);
        expect(spy.calledOnce).to.be.true;
    });

    it('should compute the real required changes', function() {
        var spy = sinon.spy();
        var store = Fluxo.createStore(true, {
            initialState: {a:1},
            init: function() {
                this.emitter.on('state-changed', spy);
            }
        });
        
        store.setState({'a':1,'b':2});

        expect(
            spy.withArgs(
                {'a':1,'b':2},      // new state
                {'b':2},            // properties that had changed
                {'a':1,'b':2}       // change request
            ).calledOnce
        ).to.be.true;

    });

});
