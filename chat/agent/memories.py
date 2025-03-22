class Memory:
    """
    This class is dedicated for storing chat memory. 

    Parameters:
        system_prompt (str): initial system prompt with task description for agent
        messages (List[dict]): list of doctionaries with chat history, possible roles - system, user, assistant, tool
    """
    def __init__(self, system_prompt:str):
        self.system_prompt = system_prompt
        self.messages = [{"role": "system", "content": system_prompt}]
