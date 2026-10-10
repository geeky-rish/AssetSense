import numpy as np
import matplotlib.pyplot as plt

def euler_maruyama_simulation():
    # Parameters
    T = 2.0        # Total time (s)
    N = 1000       # Number of steps
    dt = T / N     # Time step
    t = np.linspace(0, T, N)

    # Physics Parameters
    mu = -2.0      # Drift (restoring force)
    sigma = 1.5    # Volatility (Noise level)
    X0 = 0.0       # Initial state
    
    # Thresholds
    GAMMA_WARN = 1.0
    DEBOUNCE_TIME = 0.2  # Seconds
    debounce_steps = int(DEBOUNCE_TIME / dt)

    # 1. Generate Stochastic Process (Ornstein-Uhlenbeck)
    # dX = mu*X*dt + sigma*dW
    X = np.zeros(N)
    X[0] = X0
    
    # Add synthetic fault at t=1.0s (Drift change)
    fault_start_idx = int(0.5 * N)
    
    for i in range(1, N):
        # Normal noise
        dW = np.sqrt(dt) * np.random.normal(0, 1)
        
        # Physics update
        curr_mu = mu
        if i > fault_start_idx:
            curr_mu = 2.0 # Destabilizing force (Fault)
            
        X[i] = X[i-1] + curr_mu * X[i-1] * dt + sigma * dW
        
        # Clamp for visual cleanliness if needed, but let physics run
        
    # 2. Simulate DFA Logic (State)
    state = np.zeros(N) # 0=Safe, 1=Transient, 2=Critical
    counter = 0
    
    alert_triggered = False
    
    for i in range(N):
        if X[i] > GAMMA_WARN:
            counter += 1
            state[i] = 1 # Transient Check
            
            if counter > debounce_steps:
                state[i] = 2 # Critical
                alert_triggered = True
        else:
            counter = 0 # Reset
            state[i] = 0 # Safe
            
        # Latch critical state if diagram requires latching behavior
        # But usually simulation shows the *response*, so let's keep it reactive for "rejection" demo
        # "Rejection" implies it goes back to 0 if noise passes quickly.

    # 3. Plotting
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)
    
    # Plot Signal
    ax1.plot(t, X, label=r'Vibration Signal $X_t$', color='#1f77b4', linewidth=1.5)
    ax1.axhline(y=GAMMA_WARN, color='r', linestyle='--', label=r'Threshold $\Gamma_{warn}$')
    ax1.set_ylabel('Amplitude (g)')
    ax1.set_title(r'Euler-Maruyama Simulation: $dX_t = \mu X_t dt + \sigma dW_t$')
    ax1.grid(True, alpha=0.3)
    ax1.legend(loc='upper left')
    
    # Annotate Noise Rejection
    # Find a spike that didn't trigger
    # (Just placing text generally for the generated image context)
    ax1.text(0.2, GAMMA_WARN + 0.5, 'Gaussian Noise Rejection', fontsize=10, color='green', 
             bbox=dict(facecolor='white', alpha=0.8, edgecolor='none'))

    # Plot Automaton State
    ax2.plot(t, state, label='DFA State', color='#ff7f0e', linewidth=2)
    ax2.set_yticks([0, 1, 2])
    ax2.set_yticklabels(['Safe (0)', 'Transient (1)', 'Critical (2)'])
    ax2.set_xlabel('Time (s)')
    ax2.set_ylabel('Automaton State')
    ax2.fill_between(t, 0, state, color='#ff7f0e', alpha=0.2)
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('figure4_simulation.png', dpi=300)
    print("Graph saved to figure4_simulation.png")

if __name__ == "__main__":
    euler_maruyama_simulation()
